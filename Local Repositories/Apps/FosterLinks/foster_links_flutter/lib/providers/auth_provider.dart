import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/auth_service.dart';
import '../models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService;
  
  User? _currentUser;
  UserModel? _userModel;
  String? _userRole;
  bool _loading = true;
  String? _error;

  AuthProvider({required AuthService authService}) : _authService = authService {
    _initializeAuth();
  }

  // Getters
  User? get currentUser => _currentUser;
  UserModel? get userModel => _userModel;
  String? get userRole => _userRole;
  bool get loading => _loading;
  String? get error => _error;
  bool get isAuthenticated => _currentUser != null;
  bool get isAdmin => _userRole == 'admin';
  bool get isWorker => _userRole == 'worker';
  bool get isFosterParent => _userRole == 'foster_parent';

  void _initializeAuth() {
    _authService.authStateChanges.listen((User? user) async {
      _currentUser = user;
      
      if (user != null) {
        await _loadUserData();
      } else {
        _userModel = null;
        _userRole = null;
      }
      
      _loading = false;
      notifyListeners();
    });
  }

  Future<void> _loadUserData() async {
    try {
      _error = null;
      
      // Get user role
      _userRole = await _authService.getUserRole();
      
      // Get full user data
      final userData = await _authService.getUserData();
      if (userData != null && _currentUser != null) {
        _userModel = UserModel.fromMap(userData, _currentUser!.uid);
      }
      
    } catch (e) {
      _error = 'Failed to load user data: $e';
  // TODO: Consider logging to a service or showing a snackbar in UIProvider
    }
  }

  Future<bool> signIn(String email, String password) async {
    try {
      _loading = true;
      _error = null;
      notifyListeners();

      await _authService.signInWithEmailAndPassword(email, password);
      return true;
    } catch (e) {
      _error = _getErrorMessage(e);
      _loading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> signUp(String email, String password, {
    String? firstName,
    String? lastName,
    String role = 'foster_parent',
  }) async {
    try {
      _loading = true;
      _error = null;
      notifyListeners();

      final userCredential = await _authService.createUserWithEmailAndPassword(email, password);
      
      // Create user document in Firestore
      await _authService.createUserDocument(userCredential.user!.uid, {
        'email': email,
        'role': role,
        'firstName': firstName,
        'lastName': lastName,
        'createdAt': DateTime.now(),
        'updatedAt': DateTime.now(),
      });

      return true;
    } catch (e) {
      _error = _getErrorMessage(e);
      _loading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> signOut() async {
    try {
      await _authService.signOut();
    } catch (e) {
      _error = 'Failed to sign out: $e';
      notifyListeners();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  String _getErrorMessage(dynamic error) {
    if (error is FirebaseAuthException) {
      switch (error.code) {
        case 'user-not-found':
        case 'wrong-password':
          return 'Invalid email or password';
        case 'too-many-requests':
          return 'Too many failed login attempts. Please try again later.';
        case 'invalid-email':
          return 'Invalid email format';
        case 'user-disabled':
          return 'This account has been disabled. Please contact support.';
        case 'email-already-in-use':
          return 'An account with this email already exists';
        case 'weak-password':
          return 'Password is too weak';
        case 'operation-not-allowed':
          return 'Email/password accounts are not enabled';
        default:
          return error.message ?? 'An authentication error occurred';
      }
    }
    return error.toString();
  }
}