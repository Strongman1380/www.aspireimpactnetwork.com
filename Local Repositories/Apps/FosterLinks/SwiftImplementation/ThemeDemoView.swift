import SwiftUI

struct ThemeDemoView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @State private var progress: Double = 0.75
    @State private var isToggleOn = true
    @State private var sliderValue: Double = 30
    @State private var noteText = ""
    
    var body: some View {
        NavigationView {
            ScrollView {
                LazyVStack(spacing: 20) {
                    // Header
                    VStack(spacing: 8) {
                        Text("Theme System Demo")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(themeManager.primaryColor)
                        
                        Text("See how your theme colors are applied")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.top)
                    
                    // Profile Card
                    VStack(alignment: .leading, spacing: 16) {
                        HStack {
                            Circle()
                                .fill(themeManager.primaryColor)
                                .frame(width: 50, height: 50)
                                .overlay(
                                    Image(systemName: "person.fill")
                                        .foregroundColor(.white)
                                )
                            
                            VStack(alignment: .leading) {
                                Text("Sarah Johnson")
                                    .font(.headline)
                                    .fontWeight(.semibold)
                                Text("Foster Youth Profile")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                            
                            Spacer()
                            
                            VStack(spacing: 4) {
                                Image(systemName: "star.fill")
                                    .foregroundColor(themeManager.secondaryColor)
                                Text("4.8")
                                    .font(.caption)
                                    .fontWeight(.medium)
                            }
                        }
                        
                        // Progress Section
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text("Case Progress")
                                    .font(.subheadline)
                                    .fontWeight(.medium)
                                Spacer()
                                Text("\(Int(progress * 100))%")
                                    .font(.subheadline)
                                    .fontWeight(.semibold)
                                    .foregroundColor(themeManager.primaryColor)
                            }
                            
                            ProgressView(value: progress)
                                .progressViewStyle(LinearProgressViewStyle(tint: themeManager.primaryColor))
                                .scaleEffect(x: 1, y: 2, anchor: .center)
                        }
                        
                        // Tags
                        HStack {
                            Label("Active", systemImage: "circle.fill")
                                .font(.caption)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(themeManager.primaryColor)
                                .foregroundColor(.white)
                                .clipShape(Capsule())
                            
                            Label("Priority", systemImage: "exclamationmark.circle")
                                .font(.caption)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(themeManager.secondaryColor.opacity(0.1))
                                .foregroundColor(themeManager.secondaryColor)
                                .clipShape(Capsule())
                            
                            Spacer()
                        }
                        
                        // Action Buttons
                        HStack(spacing: 12) {
                            Button(action: {}) {
                                Text("View Details")
                                    .font(.subheadline)
                                    .fontWeight(.semibold)
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 20)
                                    .padding(.vertical, 10)
                                    .background(themeManager.primaryColor)
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                            }
                            
                            Button(action: {}) {
                                Text("Add Note")
                                    .font(.subheadline)
                                    .fontWeight(.semibold)
                                    .foregroundColor(themeManager.secondaryColor)
                                    .padding(.horizontal, 20)
                                    .padding(.vertical, 10)
                                    .background(themeManager.secondaryColor.opacity(0.1))
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                            }
                            
                            Spacer()
                        }
                    }
                    .padding()
                    .background(Color(.systemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)
                    
                    // Interactive Controls
                    VStack(alignment: .leading, spacing: 20) {
                        Text("Interactive Components")
                            .font(.headline)
                            .fontWeight(.semibold)
                        
                        // Toggle
                        HStack {
                            Text("Enable Notifications")
                                .font(.body)
                            Spacer()
                            Toggle("", isOn: $isToggleOn)
                                .tint(themeManager.primaryColor)
                        }
                        
                        // Slider
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text("Priority Level")
                                    .font(.body)
                                Spacer()
                                Text("\(Int(sliderValue))")
                                    .font(.body)
                                    .fontWeight(.semibold)
                                    .foregroundColor(themeManager.secondaryColor)
                            }
                            
                            Slider(value: $sliderValue, in: 0...100)
                                .tint(themeManager.secondaryColor)
                        }
                        
                        // Text Field
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Case Notes")
                                .font(.body)
                            
                            TextField("Enter your notes here...", text: $noteText, axis: .vertical)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .lineLimit(3...6)
                        }
                        
                        // Action Buttons
                        HStack(spacing: 12) {
                            Button("Save Changes") {
                                // Save action
                            }
                            .buttonStyle(.borderedProminent)
                            .tint(themeManager.primaryColor)
                            
                            Button("Cancel") {
                                // Cancel action
                            }
                            .buttonStyle(.bordered)
                            .tint(themeManager.secondaryColor)
                            
                            Spacer()
                        }
                    }
                    .padding()
                    .background(Color(.systemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)
                    
                    // Statistics Cards
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 16) {
                        StatCard(
                            title: "Active Cases",
                            value: "24",
                            icon: "person.3.fill",
                            color: themeManager.primaryColor
                        )
                        
                        StatCard(
                            title: "Completed",
                            value: "156",
                            icon: "checkmark.circle.fill",
                            color: themeManager.secondaryColor
                        )
                        
                        StatCard(
                            title: "Pending",
                            value: "8",
                            icon: "clock.fill",
                            color: themeManager.primaryColor
                        )
                        
                        StatCard(
                            title: "Overdue",
                            value: "2",
                            icon: "exclamationmark.triangle.fill",
                            color: .orange
                        )
                    }
                    
                    // Info Banner
                    HStack {
                        Image(systemName: "info.circle.fill")
                            .foregroundColor(themeManager.primaryColor)
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Theme Demo")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                            Text("This demo showcases how your theme colors are applied throughout the app.")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        
                        Spacer()
                    }
                    .padding()
                    .background(themeManager.primaryColor.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                }
                .padding(.horizontal)
                .padding(.bottom, 100) // Space for floating button
            }
            .navigationBarHidden(true)
            .overlay(
                // Floating Action Button
                Button(action: {}) {
                    Image(systemName: "plus")
                        .font(.title2)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                        .frame(width: 56, height: 56)
                        .background(themeManager.primaryColor)
                        .clipShape(Circle())
                        .shadow(color: themeManager.primaryColor.opacity(0.3), radius: 8, x: 0, y: 4)
                }
                .padding(.trailing, 20)
                .padding(.bottom, 20),
                alignment: .bottomTrailing
            )
        }
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)
                
                Spacer()
                
                Text(value)
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(color)
            }
            
            HStack {
                Text(title)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                Spacer()
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}

struct ThemeDemoView_Previews: PreviewProvider {
    static var previews: some View {
        ThemeDemoView()
            .environmentObject(ThemeManager())
    }
}