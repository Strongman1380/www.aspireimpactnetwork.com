import SwiftUI
import FirebaseAuth
import FirebaseFirestore

struct ContentView: View {
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Group {
            if authService.isLoading {
                LoadingView()
            } else if authService.isAuthenticated {
                DashboardView()
            } else {
                LoginView()
            }
        }
    }
}

struct DashboardView: View {
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var themeManager: ThemeManager
    @State private var youthProfiles: [YouthProfile] = []
    @State private var isLoading = true
    @State private var showingLogoutAlert = false
    
    var body: some View {
        TabView {
            YouthListView(youthProfiles: youthProfiles, isLoading: isLoading)
                .environmentObject(themeManager)
                .tabItem {
                    Label("Youth", systemImage: "person.3")
                }
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
        }
        .accentColor(themeManager.primaryColor)
        .onAppear {
            fetchYouthProfiles()
        }
    }
    
    private func fetchYouthProfiles() {
        FirestoreService.shared.fetchYouthProfiles { result in
            DispatchQueue.main.async {
                self.isLoading = false
                
                switch result {
                case .success(let profiles):
                    self.youthProfiles = profiles
                case .failure(let error):
                    print("Error fetching youth profiles: \(error.localizedDescription)")
                }
            }
        }
    }
}

struct YouthListView: View {
    @EnvironmentObject var themeManager: ThemeManager
    let youthProfiles: [YouthProfile]
    let isLoading: Bool
    
    var body: some View {
        NavigationView {
            Group {
                if isLoading {
                    ProgressView("Loading youth profiles...")
                } else if youthProfiles.isEmpty {
                    Text("No youth profiles found")
                        .foregroundColor(.secondary)
                } else {
                    List(youthProfiles) { youth in
                        NavigationLink(destination: YouthDetailView(youth: youth)) {
                            HStack {
                                Circle()
                                    .fill(themeManager.primaryColor)
                                    .frame(width: 12, height: 12)
                                
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(youth.fullName)
                                        .font(.headline)
                                        .foregroundColor(.primary)
                                    Text("Case #: \(youth.caseNumber ?? "N/A")")
                                        .font(.subheadline)
                                        .foregroundColor(.secondary)
                                }
                                
                                Spacer()
                                
                                Image(systemName: "chevron.right")
                                    .foregroundColor(themeManager.primaryColor)
                                    .font(.caption)
                            }
                            .padding(.vertical, 8)
                        }
                    }
                }
            }
            .navigationTitle("Youth Profiles")
            .toolbar {
                Button(action: {
                    // Add new youth profile
                }) {
                    Image(systemName: "plus")
                        .foregroundColor(themeManager.primaryColor)
                }
            }
        }
    }
}

struct YouthDetailView: View {
    @EnvironmentObject var themeManager: ThemeManager
    let youth: YouthProfile
    
    var body: some View {
        List {
            Section(header: Text("Personal Information")) {
                DetailRow(label: "First Name", value: youth.firstName)
                DetailRow(label: "Last Name", value: youth.lastName)
                DetailRow(label: "Date of Birth", value: formatDate(youth.dateOfBirth))
                DetailRow(label: "Gender", value: youth.gender)
            }
            
            Section(header: Text("Case Information")) {
                DetailRow(label: "Case Number", value: youth.caseNumber ?? "N/A")
            }
            
            if let notes = youth.notes, !notes.isEmpty {
                Section(header: Text("Notes")) {
                    Text(notes)
                        .font(.body)
                }
            }
        }
        .navigationTitle(youth.fullName)
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: date)
    }
}

struct DetailRow: View {
    let label: String
    let value: String
    
    var body: some View {
        HStack {
            Text(label)
                .foregroundColor(.secondary)
            Spacer()
            Text(value)
                .fontWeight(.medium)
        }
    }
}





struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}