import SwiftUI
import FirebaseAuth

struct ThemeSettingsView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @State private var showingResetAlert = false
    
    var body: some View {
            Form {
                // Theme Mode Section
                Section(header: Text("Appearance")) {
                    Toggle("Dark Mode", isOn: $themeManager.isDarkMode)
                        .tint(themeManager.primaryColor)
                }
                
                // Primary Color Section
                Section(header: Text("Primary Color")) {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 16) {
                        ForEach(themeManager.primaryColorOptions, id: \.name) { option in
                            ColorSelectionButton(
                                color: option.color,
                                name: option.name,
                                isSelected: themeManager.primaryColor == option.color
                            ) {
                                withAnimation(.easeInOut(duration: 0.3)) {
                                    themeManager.primaryColor = option.color
                                }
                            }
                        }
                    }
                    .padding(.vertical, 8)
                }
                
                // Secondary Color Section
                Section(header: Text("Secondary Color")) {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 16) {
                        ForEach(themeManager.secondaryColorOptions, id: \.name) { option in
                            ColorSelectionButton(
                                color: option.color,
                                name: option.name,
                                isSelected: themeManager.secondaryColor == option.color
                            ) {
                                withAnimation(.easeInOut(duration: 0.3)) {
                                    themeManager.secondaryColor = option.color
                                }
                            }
                        }
                    }
                    .padding(.vertical, 8)
                }
                
                // Logo Section
                Section(header: Text("Agency Logo")) {
                    if let logoURL = themeManager.logoURL {
                        HStack {
                            AsyncImage(url: URL(string: logoURL)) { image in
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                            } placeholder: {
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(Color.gray.opacity(0.3))
                                    .overlay(
                                        Image(systemName: "photo")
                                            .foregroundColor(.gray)
                                    )
                            }
                            .frame(width: 60, height: 60)
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                            
                            VStack(alignment: .leading) {
                                Text("Logo Uploaded")
                                    .font(.headline)
                                Text("Tap to change")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            
                            Spacer()
                            
                            Button("Remove") {
                                withAnimation {
                                    themeManager.logoURL = nil
                                }
                            }
                            .foregroundColor(.red)
                        }
                    } else {
                        HStack {
                            RoundedRectangle(cornerRadius: 8)
                                .fill(Color.gray.opacity(0.3))
                                .frame(width: 60, height: 60)
                                .overlay(
                                    Image(systemName: "photo.badge.plus")
                                        .foregroundColor(.gray)
                                )
                            
                            VStack(alignment: .leading) {
                                Text("No Logo")
                                    .font(.headline)
                                Text("Tap to upload")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            
                            Spacer()
                        }
                        .contentShape(Rectangle())
                        .onTapGesture {
                            // TODO: Implement image picker
                            print("Image picker not implemented yet")
                        }
                    }
                }
                
                // Preview Section
                Section(header: Text("Preview")) {
                    VStack(spacing: 16) {
                        // Sample card with current theme
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Circle()
                                    .fill(themeManager.primaryColor)
                                    .frame(width: 12, height: 12)
                                Text("Sample Youth Profile")
                                    .font(.headline)
                                    .foregroundColor(themeManager.primaryColor)
                                Spacer()
                            }
                            
                            Text("This is how your theme will look in the app")
                                .font(.body)
                                .foregroundColor(.secondary)
                            
                            HStack {
                                Button("Primary Action") {
                                    // Sample action
                                }
                                .buttonStyle(.borderedProminent)
                                .tint(themeManager.primaryColor)
                                
                                Button("Secondary") {
                                    // Sample action
                                }
                                .buttonStyle(.bordered)
                                .tint(themeManager.secondaryColor)
                                
                                Spacer()
                            }
                        }
                        .padding()
                        .background(
                            RoundedRectangle(cornerRadius: 12)
                                .fill(Color(.systemBackground))
                                .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
                        )
                    }
                }
                
                // Reset Section
                Section {
                    Button("Reset to Defaults") {
                        showingResetAlert = true
                    }
                    .foregroundColor(.red)
                }
            }
            .navigationTitle("Theme Settings")
            .navigationBarTitleDisplayMode(.large)
            .alert("Reset Theme", isPresented: $showingResetAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Reset", role: .destructive) {
                    withAnimation(.easeInOut(duration: 0.5)) {
                        themeManager.resetToDefaults()
                    }
                }
            } message: {
                Text("This will reset all theme settings to their default values.")
            }
    }
}

struct ColorSelectionButton: View {
    let color: Color
    let name: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Circle()
                    .fill(color)
                    .frame(width: 32, height: 32)
                    .overlay(
                        Circle()
                            .stroke(Color.primary, lineWidth: isSelected ? 3 : 0)
                    )
                    .scaleEffect(isSelected ? 1.1 : 1.0)
                
                Text(name)
                    .font(.caption2)
                    .foregroundColor(.primary)
            }
        }
        .buttonStyle(.plain)
        .animation(.easeInOut(duration: 0.2), value: isSelected)
    }
}

struct ThemeSettingsView_Previews: PreviewProvider {
    static var previews: some View {
        ThemeSettingsView()
            .environmentObject(ThemeManager())
    }
}