# FosterLinks Flutter Conversion Guide

This guide provides instructions for converting the FosterLinks React/TypeScript web application to a Flutter mobile application for Android and iOS.

## Overview

The FosterLinks application needs to be converted from:
- **Current**: React/TypeScript web application with Firebase backend
- **Target**: Flutter mobile application with the same Firebase backend

The good news is that Flutter can connect to the same Firebase backend, so your data will remain consistent across platforms.

## Prerequisites

1. **Flutter SDK**: [Install Flutter](https://flutter.dev/docs/get-started/install)
2. **Firebase Project**: Use your existing Firebase project
3. **IDE**: Install Android Studio or VS Code with Flutter plugins
4. **FlutterFlow** (Optional): Consider using FlutterFlow for rapid development

## Step 1: Create a New Flutter Project

```bash
# Create a new Flutter project
flutter create foster_links
cd foster_links
```

## Step 2: Set Up Firebase in Flutter

1. **Install FlutterFire CLI**:
```bash
dart pub global activate flutterfire_cli
```

2. **Configure Firebase**:
```bash
flutterfire configure --project=fosterlinks-95182
```

3. **Add Firebase packages to `pubspec.yaml`**:
```yaml
dependencies:
  flutter:
    sdk: flutter
  firebase_core: ^2.15.1
  firebase_auth: ^4.9.0
  cloud_firestore: ^4.9.1
  firebase_storage: ^11.2.6
  firebase_analytics: ^10.4.5
  provider: ^6.0.5
  flutter_form_builder: ^9.1.0
  form_builder_validators: ^9.0.0
  go_router: ^10.1.2
  flutter_secure_storage: ^8.0.0
  cached_network_image: ^3.2.3
```

4. **Initialize Firebase in `lib/main.dart`**:
```dart
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(MyApp());
}
```

## Step 3: Create Equivalent Flutter Structure

### Project Structure

```
lib/
├── main.dart                  # App entry point
├── firebase_options.dart      # Generated Firebase options
├── models/                    # Data models
├── screens/                   # App screens (equivalent to pages/)
│   ├── auth/                  # Authentication screens
│   ├── dashboard/             # Dashboard screens
│   ├── youth/                 # Youth profile screens
│   └── settings/              # Settings screens
├── widgets/                   # Reusable widgets (equivalent to components/)
├── services/                  # Firebase and other services
├── providers/                 # State management (equivalent to contexts/)
├── utils/                     # Utility functions
└── theme/                     # Theme configuration
```

### Key Components to Implement

1. **Authentication Service** (equivalent to AuthContext.tsx):
```dart
// lib/services/auth_service.dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  // Get current user
  User? get currentUser => _auth.currentUser;
  
  // Auth state changes stream
  Stream<User?> get authStateChanges => _auth.authStateChanges();
  
  // Sign in with email and password
  Future<UserCredential> signInWithEmailAndPassword(String email, String password) {
    return _auth.signInWithEmailAndPassword(email: email, password: password);
  }
  
  // Register with email and password
  Future<UserCredential> createUserWithEmailAndPassword(String email, String password) {
    return _auth.createUserWithEmailAndPassword(email: email, password: password);
  }
  
  // Sign out
  Future<void> signOut() {
    return _auth.signOut();
  }
  
  // Get user role from Firestore
  Future<String?> getUserRole() async {
    if (currentUser == null) return null;
    
    try {
      DocumentSnapshot doc = await _firestore
          .collection('users')
          .doc(currentUser!.uid)
          .get();
      
      if (doc.exists && doc.data() != null) {
        Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
        return data['role'] as String?;
      }
      return null;
    } catch (e) {
      print('Error getting user role: $e');
      return null;
    }
  }
}
```

2. **Theme Provider** (equivalent to ThemeContext.tsx):
```dart
// lib/providers/theme_provider.dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeProvider extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.light;
  Map<String, dynamic> _customColors = {};
  
  ThemeMode get themeMode => _themeMode;
  Map<String, dynamic> get customColors => _customColors;
  
  ThemeProvider() {
    _loadThemePreferences();
  }
  
  Future<void> _loadThemePreferences() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String themeMode = prefs.getString('themeMode') ?? 'light';
    _themeMode = themeMode == 'dark' ? ThemeMode.dark : ThemeMode.light;
    
    // Load custom colors if available
    String? colorsJson = prefs.getString('customColors');
    if (colorsJson != null) {
      _customColors = jsonDecode(colorsJson);
    }
    
    notifyListeners();
  }
  
  void setThemeMode(ThemeMode mode) async {
    _themeMode = mode;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString('themeMode', mode == ThemeMode.dark ? 'dark' : 'light');
    notifyListeners();
  }
  
  void setCustomColors(Map<String, dynamic> colors) async {
    _customColors = colors;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString('customColors', jsonEncode(colors));
    notifyListeners();
  }
}
```

3. **Firestore Service** (for database operations):
```dart
// lib/services/firestore_service.dart
import 'package:cloud_firestore/cloud_firestore.dart';

class FirestoreService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  // Get youth profiles
  Stream<QuerySnapshot> getYouthProfiles() {
    return _firestore.collection('youth').snapshots();
  }
  
  // Get youth profile by ID
  Stream<DocumentSnapshot> getYouthById(String id) {
    return _firestore.collection('youth').doc(id).snapshots();
  }
  
  // Add medication log
  Future<void> addMedicationLog(String youthId, Map<String, dynamic> medicationData) {
    return _firestore.collection('medications').add({
      'youthId': youthId,
      'timestamp': FieldValue.serverTimestamp(),
      ...medicationData,
    });
  }
  
  // Get medication logs for a youth
  Stream<QuerySnapshot> getMedicationLogs(String youthId) {
    return _firestore
        .collection('medications')
        .where('youthId', isEqualTo: youthId)
        .orderBy('timestamp', descending: true)
        .snapshots();
  }
  
  // Add more methods as needed for your app
}
```

## Step 4: Implement Key Screens

### Login Screen
```dart
// lib/screens/auth/login_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('FosterLinks Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset('assets/logo.png', height: 100),
              SizedBox(height: 24),
              TextFormField(
                controller: _emailController,
                decoration: InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your password';
                  }
                  return null;
                },
              ),
              SizedBox(height: 24),
              if (_errorMessage != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 16.0),
                  child: Text(
                    _errorMessage!,
                    style: TextStyle(color: Colors.red),
                  ),
                ),
              ElevatedButton(
                onPressed: _isLoading ? null : _handleLogin,
                child: _isLoading
                    ? CircularProgressIndicator(color: Colors.white)
                    : Text('Login'),
                style: ElevatedButton.styleFrom(
                  minimumSize: Size(double.infinity, 50),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _handleLogin() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      try {
        final authService = Provider.of<AuthService>(context, listen: false);
        await authService.signInWithEmailAndPassword(
          _emailController.text.trim(),
          _passwordController.text,
        );
        // Navigation will be handled by the auth state listener
      } catch (e) {
        setState(() {
          _errorMessage = 'Failed to sign in: ${e.toString()}';
          _isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
```

### Dashboard Screen
```dart
// lib/screens/dashboard/dashboard_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../services/firestore_service.dart';
import '../../widgets/dashboard_card.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final firestoreService = Provider.of<FirestoreService>(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Dashboard'),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () => authService.signOut(),
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor,
              ),
              child: Text(
                'FosterLinks',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                ),
              ),
            ),
            ListTile(
              leading: Icon(Icons.dashboard),
              title: Text('Dashboard'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.people),
              title: Text('Youth Profiles'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/youth');
              },
            ),
            ListTile(
              leading: Icon(Icons.settings),
              title: Text('Settings'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/settings');
              },
            ),
          ],
        ),
      ),
      body: FutureBuilder<String?>(
        future: authService.getUserRole(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          
          final userRole = snapshot.data;
          
          return SingleChildScrollView(
            padding: EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Welcome to FosterLinks',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                SizedBox(height: 8),
                Text(
                  'Your role: ${userRole ?? "Unknown"}',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                SizedBox(height: 24),
                
                // Dashboard cards
                GridView.count(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  children: [
                    DashboardCard(
                      title: 'Youth Profiles',
                      icon: Icons.people,
                      onTap: () => Navigator.pushNamed(context, '/youth'),
                    ),
                    DashboardCard(
                      title: 'Medication Logs',
                      icon: Icons.medication,
                      onTap: () => Navigator.pushNamed(context, '/medications'),
                    ),
                    DashboardCard(
                      title: 'Reports',
                      icon: Icons.assessment,
                      onTap: () => Navigator.pushNamed(context, '/reports'),
                    ),
                    DashboardCard(
                      title: 'Settings',
                      icon: Icons.settings,
                      onTap: () => Navigator.pushNamed(context, '/settings'),
                    ),
                  ],
                ),
                
                SizedBox(height: 24),
                Text(
                  'Recent Activity',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                SizedBox(height: 16),
                
                // Recent activity list would go here
              ],
            ),
          );
        },
      ),
    );
  }
}
```

### Dashboard Card Widget
```dart
// lib/widgets/dashboard_card.dart
import 'package:flutter/material.dart';

class DashboardCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final VoidCallback onTap;
  final Color? color;

  const DashboardCard({
    Key? key,
    required this.title,
    required this.icon,
    required this.onTap,
    this.color,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 48,
                color: color ?? Theme.of(context).primaryColor,
              ),
              SizedBox(height: 12),
              Text(
                title,
                style: Theme.of(context).textTheme.titleMedium,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

### Youth Profiles Screen
```dart
// lib/screens/youth/youth_profiles_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../services/firestore_service.dart';
import '../../models/youth_profile.dart';
import '../../widgets/youth_card.dart';

class YouthProfilesScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final firestoreService = Provider.of<FirestoreService>(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Youth Profiles'),
        actions: [
          IconButton(
            icon: Icon(Icons.add),
            onPressed: () => Navigator.pushNamed(context, '/youth/add'),
          ),
        ],
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: firestoreService.getYouthProfiles(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(
              child: Text('Error: ${snapshot.error}'),
            );
          }

          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }

          final youthDocs = snapshot.data!.docs;

          if (youthDocs.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.people_outline, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text(
                    'No youth profiles found',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Tap the + button to add a new profile',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: EdgeInsets.all(16),
            itemCount: youthDocs.length,
            itemBuilder: (context, index) {
              final doc = youthDocs[index];
              final youthData = doc.data() as Map<String, dynamic>;
              final youth = YouthProfile.fromMap(youthData, doc.id);
              
              return YouthCard(
                youth: youth,
                onTap: () => Navigator.pushNamed(
                  context,
                  '/youth/detail',
                  arguments: youth.id,
                ),
              );
            },
          );
        },
      ),
    );
  }
}
```

### Youth Profile Model
```dart
// lib/models/youth_profile.dart
class YouthProfile {
  final String id;
  final String firstName;
  final String lastName;
  final DateTime dateOfBirth;
  final String? photoUrl;
  final String? medicalInfo;
  final List<String> allergies;
  final Map<String, dynamic> emergencyContacts;
  final DateTime createdAt;
  final DateTime updatedAt;

  YouthProfile({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.dateOfBirth,
    this.photoUrl,
    this.medicalInfo,
    this.allergies = const [],
    this.emergencyContacts = const {},
    required this.createdAt,
    required this.updatedAt,
  });

  factory YouthProfile.fromMap(Map<String, dynamic> map, String id) {
    return YouthProfile(
      id: id,
      firstName: map['firstName'] ?? '',
      lastName: map['lastName'] ?? '',
      dateOfBirth: (map['dateOfBirth'] as Timestamp).toDate(),
      photoUrl: map['photoUrl'],
      medicalInfo: map['medicalInfo'],
      allergies: List<String>.from(map['allergies'] ?? []),
      emergencyContacts: Map<String, dynamic>.from(map['emergencyContacts'] ?? {}),
      createdAt: (map['createdAt'] as Timestamp).toDate(),
      updatedAt: (map['updatedAt'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'firstName': firstName,
      'lastName': lastName,
      'dateOfBirth': Timestamp.fromDate(dateOfBirth),
      'photoUrl': photoUrl,
      'medicalInfo': medicalInfo,
      'allergies': allergies,
      'emergencyContacts': emergencyContacts,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': Timestamp.fromDate(updatedAt),
    };
  }

  String get fullName => '$firstName $lastName';
  
  int get age {
    final now = DateTime.now();
    int age = now.year - dateOfBirth.year;
    if (now.month < dateOfBirth.month || 
        (now.month == dateOfBirth.month && now.day < dateOfBirth.day)) {
      age--;
    }
    return age;
  }
}
```

### Youth Card Widget
```dart
// lib/widgets/youth_card.dart
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/youth_profile.dart';

class YouthCard extends StatelessWidget {
  final YouthProfile youth;
  final VoidCallback onTap;

  const YouthCard({
    Key? key,
    required this.youth,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: CircleAvatar(
          radius: 25,
          backgroundImage: youth.photoUrl != null
              ? CachedNetworkImageProvider(youth.photoUrl!)
              : null,
          child: youth.photoUrl == null
              ? Text(
                  youth.firstName.isNotEmpty ? youth.firstName[0].toUpperCase() : '?',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                )
              : null,
        ),
        title: Text(
          youth.fullName,
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Age: ${youth.age}'),
            if (youth.allergies.isNotEmpty)
              Text(
                'Allergies: ${youth.allergies.join(', ')}',
                style: TextStyle(color: Colors.red[600], fontSize: 12),
              ),
          ],
        ),
        trailing: Icon(Icons.arrow_forward_ios),
        onTap: onTap,
      ),
    );
  }
}
```

### Youth Detail Screen
```dart
// lib/screens/youth/youth_detail_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../services/firestore_service.dart';
import '../../models/youth_profile.dart';
import '../../widgets/medication_log_card.dart';

class YouthDetailScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final String youthId = ModalRoute.of(context)!.settings.arguments as String;
    final firestoreService = Provider.of<FirestoreService>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Youth Profile'),
        actions: [
          IconButton(
            icon: Icon(Icons.edit),
            onPressed: () => Navigator.pushNamed(
              context,
              '/youth/edit',
              arguments: youthId,
            ),
          ),
        ],
      ),
      body: StreamBuilder<DocumentSnapshot>(
        stream: firestoreService.getYouthById(youthId),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }

          if (!snapshot.hasData || !snapshot.data!.exists) {
            return Center(child: Text('Youth profile not found'));
          }

          final youthData = snapshot.data!.data() as Map<String, dynamic>;
          final youth = YouthProfile.fromMap(youthData, snapshot.data!.id);

          return SingleChildScrollView(
            child: Column(
              children: [
                // Profile Header
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Theme.of(context).primaryColor,
                        Theme.of(context).primaryColor.withOpacity(0.8),
                      ],
                    ),
                  ),
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 50,
                        backgroundImage: youth.photoUrl != null
                            ? CachedNetworkImageProvider(youth.photoUrl!)
                            : null,
                        child: youth.photoUrl == null
                            ? Text(
                                youth.firstName.isNotEmpty ? youth.firstName[0].toUpperCase() : '?',
                                style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold),
                              )
                            : null,
                      ),
                      SizedBox(height: 16),
                      Text(
                        youth.fullName,
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        'Age: ${youth.age}',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.white70,
                        ),
                      ),
                    ],
                  ),
                ),

                // Profile Details
                Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildInfoSection(
                        context,
                        'Basic Information',
                        [
                          _buildInfoRow('Date of Birth', youth.dateOfBirth.toString().split(' ')[0]),
                          _buildInfoRow('Age', '${youth.age} years old'),
                        ],
                      ),

                      if (youth.allergies.isNotEmpty)
                        _buildInfoSection(
                          context,
                          'Allergies',
                          youth.allergies.map((allergy) => 
                            Chip(
                              label: Text(allergy),
                              backgroundColor: Colors.red[100],
                              labelStyle: TextStyle(color: Colors.red[800]),
                            )
                          ).toList(),
                        ),

                      if (youth.medicalInfo != null && youth.medicalInfo!.isNotEmpty)
                        _buildInfoSection(
                          context,
                          'Medical Information',
                          [Text(youth.medicalInfo!)],
                        ),

                      // Medication Logs Section
                      SizedBox(height: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Medication Logs',
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          ElevatedButton.icon(
                            onPressed: () => Navigator.pushNamed(
                              context,
                              '/medications/add',
                              arguments: youthId,
                            ),
                            icon: Icon(Icons.add),
                            label: Text('Add Log'),
                          ),
                        ],
                      ),
                      SizedBox(height: 16),
                      
                      StreamBuilder<QuerySnapshot>(
                        stream: firestoreService.getMedicationLogs(youthId),
                        builder: (context, medicationSnapshot) {
                          if (medicationSnapshot.hasError) {
                            return Text('Error loading medication logs');
                          }

                          if (medicationSnapshot.connectionState == ConnectionState.waiting) {
                            return Center(child: CircularProgressIndicator());
                          }

                          final medicationDocs = medicationSnapshot.data!.docs;

                          if (medicationDocs.isEmpty) {
                            return Card(
                              child: Padding(
                                padding: EdgeInsets.all(16),
                                child: Text(
                                  'No medication logs found',
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                              ),
                            );
                          }

                          return Column(
                            children: medicationDocs.map((doc) {
                              final medicationData = doc.data() as Map<String, dynamic>;
                              return MedicationLogCard(
                                medicationData: medicationData,
                                onTap: () => Navigator.pushNamed(
                                  context,
                                  '/medications/detail',
                                  arguments: doc.id,
                                ),
                              );
                            }).toList(),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildInfoSection(BuildContext context, String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(height: 24),
        Text(
          title,
          style: Theme.of(context).textTheme.titleLarge,
        ),
        SizedBox(height: 12),
        Card(
          child: Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: children,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              '$label:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
```

### Medication Log Card Widget
```dart
// lib/widgets/medication_log_card.dart
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class MedicationLogCard extends StatelessWidget {
  final Map<String, dynamic> medicationData;
  final VoidCallback onTap;

  const MedicationLogCard({
    Key? key,
    required this.medicationData,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final timestamp = (medicationData['timestamp'] as Timestamp?)?.toDate();
    final medicationName = medicationData['medicationName'] ?? 'Unknown Medication';
    final dosage = medicationData['dosage'] ?? 'Unknown Dosage';
    final administeredBy = medicationData['administeredBy'] ?? 'Unknown';

    return Card(
      margin: EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).primaryColor,
          child: Icon(Icons.medication, color: Colors.white),
        ),
        title: Text(
          medicationName,
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Dosage: $dosage'),
            Text('Administered by: $administeredBy'),
            if (timestamp != null)
              Text(
                'Time: ${timestamp.toString().split('.')[0]}',
                style: TextStyle(fontSize: 12, color: Colors.grey[600]),
              ),
          ],
        ),
        trailing: Icon(Icons.arrow_forward_ios),
        onTap: onTap,
      ),
    );
  }
}
```

### Settings Screen
```dart
// lib/screens/settings/settings_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../providers/theme_provider.dart';

class SettingsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Settings'),
      ),
      body: ListView(
        padding: EdgeInsets.all(16),
        children: [
          // Theme Settings
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: Icon(Icons.palette),
                  title: Text('Appearance'),
                  subtitle: Text('Customize the app theme'),
                ),
                Divider(height: 1),
                ListTile(
                  title: Text('Dark Mode'),
                  trailing: Switch(
                    value: themeProvider.themeMode == ThemeMode.dark,
                    onChanged: (value) {
                      themeProvider.setThemeMode(
                        value ? ThemeMode.dark : ThemeMode.light,
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          SizedBox(height: 16),

          // Account Settings
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: Icon(Icons.account_circle),
                  title: Text('Account'),
                  subtitle: Text('Manage your account settings'),
                ),
                Divider(height: 1),
                ListTile(
                  leading: Icon(Icons.email),
                  title: Text('Email'),
                  subtitle: Text(authService.currentUser?.email ?? 'Not available'),
                ),
                ListTile(
                  leading: Icon(Icons.lock),
                  title: Text('Change Password'),
                  trailing: Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    // Navigate to change password screen
                  },
                ),
              ],
            ),
          ),

          SizedBox(height: 16),

          // App Settings
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: Icon(Icons.settings),
                  title: Text('App Settings'),
                  subtitle: Text('Configure app behavior'),
                ),
                Divider(height: 1),
                ListTile(
                  leading: Icon(Icons.notifications),
                  title: Text('Notifications'),
                  trailing: Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    // Navigate to notification settings
                  },
                ),
                ListTile(
                  leading: Icon(Icons.security),
                  title: Text('Privacy & Security'),
                  trailing: Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    // Navigate to privacy settings
                  },
                ),
              ],
            ),
          ),

          SizedBox(height: 16),

          // About Section
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: Icon(Icons.info),
                  title: Text('About'),
                  subtitle: Text('App information and support'),
                ),
                Divider(height: 1),
                ListTile(
                  leading: Icon(Icons.help),
                  title: Text('Help & Support'),
                  trailing: Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    // Navigate to help screen
                  },
                ),
                ListTile(
                  leading: Icon(Icons.description),
                  title: Text('Terms of Service'),
                  trailing: Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    // Navigate to terms screen
                  },
                ),
                ListTile(
                  leading: Icon(Icons.privacy_tip),
                  title: Text('Privacy Policy'),
                  trailing: Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    // Navigate to privacy policy screen
                  },
                ),
              ],
            ),
          ),

          SizedBox(height: 32),

          // Sign Out Button
          ElevatedButton.icon(
            onPressed: () => _showSignOutDialog(context, authService),
            icon: Icon(Icons.logout),
            label: Text('Sign Out'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              minimumSize: Size(double.infinity, 50),
            ),
          ),
        ],
      ),
    );
  }

  void _showSignOutDialog(BuildContext context, AuthService authService) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Sign Out'),
          content: Text('Are you sure you want to sign out?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                authService.signOut();
              },
              child: Text('Sign Out'),
              style: TextButton.styleFrom(foregroundColor: Colors.red),
            ),
          ],
        );
      },
    );
  }
}
```

## Step 5: Set Up Navigation

```dart
// lib/main.dart
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'firebase_options.dart';
import 'services/auth_service.dart';
import 'services/firestore_service.dart';
import 'providers/theme_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/dashboard/dashboard_screen.dart';
import 'screens/youth/youth_profiles_screen.dart';
import 'screens/youth/youth_detail_screen.dart';
import 'screens/settings/settings_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<AuthService>(
          create: (_) => AuthService(),
        ),
        Provider<FirestoreService>(
          create: (_) => FirestoreService(),
        ),
        ChangeNotifierProvider<ThemeProvider>(
          create: (_) => ThemeProvider(),
        ),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, _) {
          return MaterialApp(
            title: 'FosterLinks',
            theme: ThemeData(
              primarySwatch: Colors.blue,
              brightness: Brightness.light,
              // Apply custom colors from themeProvider if available
            ),
            darkTheme: ThemeData(
              primarySwatch: Colors.blue,
              brightness: Brightness.dark,
              // Apply custom colors from themeProvider if available
            ),
            themeMode: themeProvider.themeMode,
            home: AuthWrapper(),
            routes: {
              '/login': (context) => LoginScreen(),
              '/dashboard': (context) => DashboardScreen(),
              '/youth': (context) => YouthProfilesScreen(),
              '/youth/detail': (context) => YouthDetailScreen(),
              '/settings': (context) => SettingsScreen(),
            },
          );
        },
      ),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    
    return StreamBuilder<User?>(
      stream: authService.authStateChanges,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.active) {
          final user = snapshot.data;
          if (user == null) {
            return LoginScreen();
          }
          return DashboardScreen();
        }
        
        // Show loading indicator while checking auth state
        return Scaffold(
          body: Center(
            child: CircularProgressIndicator(),
          ),
        );
      },
    );
  }
}
```

## Step 6: FlutterFlow Integration (Optional)

If you want to use FlutterFlow to accelerate development:

1. Follow the instructions in your existing `FLUTTERFLOW_SETUP.md` file
2. Import your Firebase project into FlutterFlow
3. Use FlutterFlow to design your UI
4. Export the FlutterFlow project as Flutter code
5. Integrate any custom logic from the steps above into the exported code

## Step 7: Testing and Deployment

1. **Test on Emulators**:
```bash
flutter run
```

2. **Build for Android**:
```bash
flutter build apk --release
```

3. **Build for iOS** (requires macOS):
```bash
flutter build ios --release
```

4. **Deploy to App Stores**:
   - Follow the [Android deployment guide](https://flutter.dev/docs/deployment/android)
   - Follow the [iOS deployment guide](https://flutter.dev/docs/deployment/ios)

## Data Migration Considerations

- Your Flutter app will use the same Firebase backend as your React app
- No data migration is needed as both apps will read from and write to the same database
- Ensure your Firestore security rules allow access from both web and mobile clients
- Test thoroughly to ensure data consistency between platforms

## Additional Resources

- [Flutter Documentation](https://flutter.dev/docs)
- [FlutterFire Documentation](https://firebase.flutter.dev/docs/overview)
- [Flutter State Management](https://flutter.dev/docs/development/data-and-backend/state-mgmt/options)
- [Flutter Navigation](https://flutter.dev/docs/cookbook/navigation)
- [Flutter Forms](https://flutter.dev/docs/cookbook/forms)
- [FlutterFlow Documentation](https://docs.flutterflow.io/)

## Next Steps

1. Start by implementing the authentication flow
2. Create the basic UI components
3. Implement the Firebase services
4. Build the main screens one by one
5. Test thoroughly on both Android and iOS
6. Deploy to app stores

Remember that this is a significant undertaking, but Flutter's cross-platform capabilities will allow you to maintain a single codebase for both Android and iOS apps while connecting to your existing Firebase backend.