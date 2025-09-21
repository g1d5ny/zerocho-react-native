import ExpoModulesCore
import Foundation
import BackgroundTasks

public class BackgroundUploaderModule: Module {
  
  public func definition() -> ModuleDefinition {
    Name("BackgroundUploader")
    
    // 백그라운드 업로드 함수 정의
    AsyncFunction("uploadInBackground") { (params: [String: Any]) -> Promise<String> in
      return Promise { resolve, reject in
        guard let threadId = params["threadId"] as? String,
              let filePaths = params["filePaths"] as? [String] else {
          reject("INVALID_PARAMS", "threadId와 filePaths는 필수입니다")
          return
        }
        
        let text = params["text"] as? String ?? ""
        let hashtag = params["hashtag"] as? String ?? ""
        let latitude = params["latitude"] as? Double
        let longitude = params["longitude"] as? Double
        
        self.performBackgroundUpload(
          threadId: threadId,
          text: text,
          hashtag: hashtag,
          latitude: latitude,
          longitude: longitude,
          filePaths: filePaths,
          resolve: resolve,
          reject: reject
        )
      }
    }
    
    // 업로드 상태 확인 함수
    Function("getUploadStatus") { (threadId: String) -> String in
      return "uploading"
    }
  }
  
  private func performBackgroundUpload(
    threadId: String,
    text: String,
    hashtag: String,
    latitude: Double?,
    longitude: Double?,
    filePaths: [String],
    resolve: @escaping (Any?) -> Void,
    reject: @escaping (Exception) -> Void
  ) {
    
    // 백그라운드 태스크 시작
    var backgroundTaskID: UIBackgroundTaskIdentifier = .invalid
    
    backgroundTaskID = UIApplication.shared.beginBackgroundTask(withName: "BackgroundUpload") {
      UIApplication.shared.endBackgroundTask(backgroundTaskID)
      backgroundTaskID = .invalid
    }
    
    // URLSession 설정
    let config = URLSessionConfiguration.background(withIdentifier: "com.jiwoniii.backgroundUploader.\(threadId)")
    let session = URLSession(configuration: config, delegate: UploadDelegate(threadId: threadId, resolve: resolve, reject: reject), delegateQueue: nil)
    
    // 멀티파트 요청 생성
    let boundary = "Boundary-\(UUID().uuidString)"
    var body = Data()
    
    // 텍스트 필드 추가
    body.append("--\(boundary)\r\n".data(using: .utf8)!)
    body.append("Content-Disposition: form-data; name=\"threadId\"\r\n\r\n".data(using: .utf8)!)
    body.append("\(threadId)\r\n".data(using: .utf8)!)
    
    body.append("--\(boundary)\r\n".data(using: .utf8)!)
    body.append("Content-Disposition: form-data; name=\"text\"\r\n\r\n".data(using: .utf8)!)
    body.append("\(text)\r\n".data(using: .utf8)!)
    
    body.append("--\(boundary)\r\n".data(using: .utf8)!)
    body.append("Content-Disposition: form-data; name=\"hashtag\"\r\n\r\n".data(using: .utf8)!)
    body.append("\(hashtag)\r\n".data(using: .utf8)!)
    
    // 위치 정보 추가 (있는 경우)
    if let lat = latitude, let lon = longitude {
      body.append("--\(boundary)\r\n".data(using: .utf8)!)
      body.append("Content-Disposition: form-data; name=\"latitude\"\r\n\r\n".data(using: .utf8)!)
      body.append("\(lat)\r\n".data(using: .utf8)!)
      
      body.append("--\(boundary)\r\n".data(using: .utf8)!)
      body.append("Content-Disposition: form-data; name=\"longitude\"\r\n\r\n".data(using: .utf8)!)
      body.append("\(lon)\r\n".data(using: .utf8)!)
    }
    
    // 파일들 추가
    for filePath in filePaths {
      let cleanPath = filePath.replacingOccurrences(of: "file://", with: "")
      let url = URL(fileURLWithPath: cleanPath)
      
      guard FileManager.default.fileExists(atPath: cleanPath) else {
        print("파일이 존재하지 않습니다: \(cleanPath)")
        continue
      }
      
      do {
        let fileData = try Data(contentsOf: url)
        let mimeType = self.guessMimeType(for: url.pathExtension)
        
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"files\"; filename=\"\(url.lastPathComponent)\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: \(mimeType)\r\n\r\n".data(using: .utf8)!)
        body.append(fileData)
        body.append("\r\n".data(using: .utf8)!)
        
        print("업로드 준비된 파일: \(cleanPath)")
      } catch {
        print("파일 읽기 오류: \(error)")
        continue
      }
    }
    
    body.append("--\(boundary)--\r\n".data(using: .utf8)!)
    
    // 요청 생성
    var request = URLRequest(url: URL(string: "https://threads.zerocho.com")!)
    request.httpMethod = "POST"
    request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
    request.setValue("\(body.count)", forHTTPHeaderField: "Content-Length")
    
    // 업로드 태스크 시작
    let task = session.uploadTask(with: request, from: body)
    task.resume()
    
    // 백그라운드 태스크 종료
    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
      UIApplication.shared.endBackgroundTask(backgroundTaskID)
      backgroundTaskID = .invalid
    }
  }
  
  private func guessMimeType(for fileExtension: String) -> String {
    switch fileExtension.lowercased() {
    case "jpg", "jpeg":
      return "image/jpeg"
    case "png":
      return "image/png"
    case "gif":
      return "image/gif"
    case "mp4":
      return "video/mp4"
    default:
      return "application/octet-stream"
    }
  }
}

// URLSession 델리게이트 클래스
class UploadDelegate: NSObject, URLSessionDelegate, URLSessionTaskDelegate {
  private let threadId: String
  private let resolve: (Any?) -> Void
  private let reject: (Exception) -> Void
  
  init(threadId: String, resolve: @escaping (Any?) -> Void, reject: @escaping (Exception) -> Void) {
    self.threadId = threadId
    self.resolve = resolve
    self.reject = reject
  }
  
  func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
    if let error = error {
      print("업로드 오류: \(error)")
      sendUploadEvent(success: false, threadId: threadId)
      reject(Exception(name: "UPLOAD_FAILED", description: error.localizedDescription, code: "UPLOAD_FAILED"))
    } else {
      print("업로드 성공: \(threadId)")
      sendUploadEvent(success: true, threadId: threadId)
      resolve("Upload completed successfully")
    }
  }
  
  func urlSession(_ session: URLSession, task: URLSessionTask, didSendBodyData bytesSent: Int64, totalBytesSent: Int64, totalBytesExpectedToSend: Int64) {
    let progress = Double(totalBytesSent) / Double(totalBytesExpectedToSend)
    print("업로드 진행률: \(Int(progress * 100))%")
  }
  
  private func sendUploadEvent(success: Bool, threadId: String) {
    DispatchQueue.main.async {
      NotificationCenter.default.post(
        name: NSNotification.Name("com.jiwoniii.backgroundUploader.UPLOAD_FINISHED"),
        object: nil,
        userInfo: [
          "success": success,
          "threadId": threadId
        ]
      )
    }
  }
}