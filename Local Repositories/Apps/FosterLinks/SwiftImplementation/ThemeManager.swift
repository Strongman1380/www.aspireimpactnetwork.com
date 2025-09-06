import SwiftUI
import Combine
import FirebaseFirestore
import FirebaseAuth

class ThemeManager: ObservableObject {
    @Published var primaryColor: Color {
        didSet {
            saveThemeToFirestore()
        }
    }
    
    @Published var secondaryColor: Color {
        didSet {
            saveThemeToFirestore()
        }
    }
    
    @Published var isDarkMode: Bool {
        didSet {
            saveThemeToFirestore()
        }
    }
    
    @Published var logoURL: String? {
        didSet {
            saveThemeToFirestore()
        }
    }
    
    @Published var isLoading = false
    
    private let db = Firestore.firestore()
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        // Set default values
        self.primaryColor = .blue
        self.secondaryColor = .pink
        self.isDarkMode = false
        self.logoURL = nil
        
        // Listen for auth state changes
        Auth.auth().addStateDidChangeListener { [weak self] _, user in
            if let user = user {
                self?.loadThemeFromFirestore(userId: user.uid)
            } else {
                // User logged out, reset to default theme without saving
                self?.resetToDefaultsWithoutSaving()
            }
        }
    }
    
    // MARK: - Firestore Operations
    
    private func saveThemeToFirestore() {
        guard let user = Auth.auth().currentUser else { return }
        
        let themeData: [String: Any] = [
            "primaryColor": colorToHex(primaryColor),
            "secondaryColor": colorToHex(secondaryColor),
            "mode": isDarkMode ? "dark" : "light",
            "logoUrl": logoURL ?? NSNull(),
            "updatedAt": FieldValue.serverTimestamp()
        ]
        
        db.collection("themes").document(user.uid).setData(themeData, merge: true) { error in
            if let error = error {
                print("Error saving theme: \(error.localizedDescription)")
            } else {
                print("Theme saved successfully")
            }
        }
    }
    
    private func loadThemeFromFirestore(userId: String) {
        isLoading = true
        
        db.collection("themes").document(userId).getDocument { [weak self] document, error in
            DispatchQueue.main.async {
                self?.isLoading = false
                
                if let error = error {
                    print("Error loading theme: \(error.localizedDescription)")
                    return
                }
                
                guard let document = document, document.exists,
                      let data = document.data() else {
                    print("No theme data found, using defaults")
                    return
                }
                
                // Update theme properties
                if let primaryColorHex = data["primaryColor"] as? String {
                    self?.primaryColor = Color(hex: primaryColorHex) ?? .blue
                }
                
                if let secondaryColorHex = data["secondaryColor"] as? String {
                    self?.secondaryColor = Color(hex: secondaryColorHex) ?? .pink
                }
                
                if let mode = data["mode"] as? String {
                    self?.isDarkMode = mode == "dark"
                }
                
                if let logoUrl = data["logoUrl"] as? String, !logoUrl.isEmpty {
                    self?.logoURL = logoUrl
                }
                
                print("Theme loaded successfully")
            }
        }
    }
    
    // MARK: - Color Utilities
    
    private func colorToHex(_ color: Color) -> String {
        let uiColor = UIColor(color)
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        var alpha: CGFloat = 0
        
        uiColor.getRed(&red, green: &green, blue: &blue, alpha: &alpha)
        
        return String(format: "#%02X%02X%02X",
                     Int(red * 255),
                     Int(green * 255),
                     Int(blue * 255))
    }
    
    // MARK: - Preset Colors
    
    var primaryColorOptions: [(name: String, color: Color)] {
        [
            ("Blue", .blue),
            ("Purple", .purple),
            ("Green", .green),
            ("Orange", .orange),
            ("Red", .red),
            ("Teal", .teal),
            ("Indigo", .indigo)
        ]
    }
    
    var secondaryColorOptions: [(name: String, color: Color)] {
        [
            ("Pink", .pink),
            ("Mint", .mint),
            ("Yellow", .yellow),
            ("Cyan", .cyan),
            ("Brown", .brown),
            ("Gray", .gray)
        ]
    }
    
    // MARK: - Theme Reset
    
    func resetToDefaults() {
        // Temporarily disable Firestore saving during reset
        let shouldSave = Auth.auth().currentUser != nil
        
        // Reset to default values without triggering didSet observers
        _primaryColor.wrappedValue = .blue
        _secondaryColor.wrappedValue = .pink
        _isDarkMode.wrappedValue = false
        _logoURL.wrappedValue = nil
        
        // Save to Firestore only if user is logged in
        if shouldSave {
            saveThemeToFirestore()
        }
    }
    
    private func resetToDefaultsWithoutSaving() {
        _primaryColor.wrappedValue = .blue
        _secondaryColor.wrappedValue = .pink
        _isDarkMode.wrappedValue = false
        _logoURL.wrappedValue = nil
    }
}

// MARK: - Color Extension for Hex Support

extension Color {
    init?(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            return nil
        }
        
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}