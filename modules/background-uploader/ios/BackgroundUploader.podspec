Pod::Spec.new do |s|
  s.name           = 'BackgroundUploader'
  s.version        = '1.0.0'
  s.summary        = 'Background file uploader for React Native'
  s.description    = 'A module for uploading files in the background on iOS'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # 백그라운드 업로드를 위한 시스템 프레임워크들
  s.frameworks = [
    'Foundation',
    'UIKit',
    'BackgroundTasks',
    'UserNotifications'
  ]

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end