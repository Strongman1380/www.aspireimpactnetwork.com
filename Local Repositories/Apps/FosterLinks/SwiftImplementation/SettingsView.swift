import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var themeManager: ThemeManager
    @State private var showingLogoutAlert = false
    @State private var showingThemeSettings = false
    
    var body: some View {
        NavigationView {
            List {
                // User Section
                Section(header: Text("Account")) {
                    HStack {
                        Image(systemName: "person.circle.fill")
                            .foregroundColor(themeManager.primaryColor)
                            .font(.title2)
                        
                        VStack(alignment: .leading) {
                            Text(authService.currentUser?.email ?? "Unknown User")
                                .font(.headline)
                            Text("Role: \(authService.userRole?.capitalized ?? "Unknown")")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        
                        Spacer()
                    }
                    .padding(.vertical, 4)
                }
                
                // Theme Section
                Section(header: Text("Appearance")) {
                    NavigationLink(destination: ThemeSettingsView()) {
                        HStack {
                            Image(systemName: "paintbrush.fill")
                                .foregroundColor(themeManager.primaryColor)
                                .font(.title3)
                            
                            VStack(alignment: .leading) {
                                Text("Theme Settings")
                                    .font(.body)
                                Text("Customize colors and appearance")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            
                            Spacer()
                        }
                        .padding(.vertical, 4)
                    }
                    
                    // Quick theme preview
                    HStack {
                        Image(systemName: "circle.fill")
                            .foregroundColor(themeManager.primaryColor)
                        Text("Primary Color")
                        Spacer()
                        Image(systemName: "circle.fill")
                            .foregroundColor(themeManager.secondaryColor)
                        Text("Secondary Color")
                    }
                    .font(.caption)
                    .foregroundColor(.secondary)
                }
                
                // App Section
                Section(header: Text("Application")) {
                    HStack {
                        Image(systemName: "info.circle")
                            .foregroundColor(themeManager.primaryColor)
                            .font(.title3)
                        
                        VStack(alignment: .leading) {
                            Text("About FosterLinks")
                                .font(.body)
                            Text("Version 1.0.0")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        
                        Spacer()
                    }
                    .padding(.vertical, 4)
                }
                
                // Logout Section
                Section {
                    Button(action: {
                        showingLogoutAlert = true
                    }) {
                        HStack {
                            Image(systemName: "arrow.right.square")
                                .foregroundColor(.red)
                                .font(.title3)
                            
                            Text("Sign Out")
                                .foregroundColor(.red)
                                .font(.body)
                            
                            Spacer()
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
            .navigationTitle("Settings")
            .alert("Sign Out", isPresented: $showingLogoutAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Sign Out", role: .destructive) {
                    signOut()
                }
            } message: {
                Text("Are you sure you want to sign out?")
            }
        }
    }
    
    private func signOut() {
        do {
            try authService.signOut()
        } catch {
            print("Error signing out: \(error.localizedDescription)")
        }
    }
}

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
            .environmentObject(AuthService.shared)
            .environmentObject(ThemeManager())
    }
}