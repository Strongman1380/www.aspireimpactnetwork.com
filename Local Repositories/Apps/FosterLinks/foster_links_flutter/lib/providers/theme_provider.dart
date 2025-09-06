import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class ThemeProvider extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.light;
  Map<String, dynamic> _customColors = {};
  
  ThemeMode get themeMode => _themeMode;
  Map<String, dynamic> get customColors => _customColors;
  
  bool get isDarkMode => _themeMode == ThemeMode.dark;
  bool get isLightMode => _themeMode == ThemeMode.light;
  bool get isSystemMode => _themeMode == ThemeMode.system;

  ThemeProvider() {
    _loadThemePreferences();
  }
  
  Future<void> _loadThemePreferences() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String themeMode = prefs.getString('themeMode') ?? 'light';
      
      switch (themeMode) {
        case 'dark':
          _themeMode = ThemeMode.dark;
          break;
        case 'system':
          _themeMode = ThemeMode.system;
          break;
        default:
          _themeMode = ThemeMode.light;
      }
      
      // Load custom colors if available
      String? colorsJson = prefs.getString('customColors');
      if (colorsJson != null) {
        _customColors = jsonDecode(colorsJson);
      }
      
      notifyListeners();
    } catch (e) {
  // TODO: Consider logging to a service or showing a snackbar in UIProvider
    }
  }
  
  Future<void> setThemeMode(ThemeMode mode) async {
    _themeMode = mode;
    
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String modeString;
      switch (mode) {
        case ThemeMode.dark:
          modeString = 'dark';
          break;
        case ThemeMode.system:
          modeString = 'system';
          break;
        default:
          modeString = 'light';
      }
      await prefs.setString('themeMode', modeString);
    } catch (e) {
  // TODO: Consider logging to a service or showing a snackbar in UIProvider
    }
    
    notifyListeners();
  }
  
  Future<void> setCustomColors(Map<String, dynamic> colors) async {
    _customColors = colors;
    
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('customColors', jsonEncode(colors));
    } catch (e) {
  // TODO: Consider logging to a service or showing a snackbar in UIProvider
    }
    
    notifyListeners();
  }
  
  Future<void> resetCustomColors() async {
    _customColors = {};
    
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.remove('customColors');
    } catch (e) {
  // TODO: Consider logging to a service or showing a snackbar in UIProvider
    }
    
    notifyListeners();
  }
  
  Color? getCustomColor(String key) {
    final colorValue = _customColors[key];
    if (colorValue is int) {
      return Color(colorValue);
    }
    return null;
  }
  
  void setCustomColor(String key, Color color) {
    _customColors[key] = color.value;
    _saveCustomColors();
    notifyListeners();
  }
  
  Future<void> _saveCustomColors() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('customColors', jsonEncode(_customColors));
    } catch (e) {
  // TODO: Consider logging to a service or showing a snackbar in UIProvider
    }
  }
}