import SwiftUI
import FirebaseCore

@main
struct FosterLinksApp: App {
    // Register app delegate for Firebase setup
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    @StateObject private var authService = AuthService.shared
    @StateObject private var themeManager = ThemeManager()
    
    var body: some Scene {
        WindowGroup {
            NavigationView {
                ContentView()
            }
            .environmentObject(authService)
            .environmentObject(themeManager)
            .preferredColorScheme(themeManager.isDarkMode ? .dark : .light)
            .animation(.easeInOut(duration: 0.3), value: themeManager.isDarkMode)
            .animation(.easeInOut(duration: 0.3), value: themeManager.primaryColor)
            .animation(.easeInOut(duration: 0.3), value: themeManager.secondaryColor)
        }
    }
}