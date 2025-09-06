import 'package:flutter_test/flutter_test.dart';
import 'package:foster_links_flutter/providers/theme_provider.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('ThemeProvider', () {
    test('defaults to light mode and switches to dark', () async {
      SharedPreferences.setMockInitialValues({});
      final provider = ThemeProvider();
      // Wait a tick for async load
      await Future.delayed(const Duration(milliseconds: 10));
      expect(provider.isLightMode, true);
      await provider.setThemeMode(ThemeMode.dark);
      expect(provider.isDarkMode, true);
    });

    test('persists custom colors', () async {
      SharedPreferences.setMockInitialValues({});
      final provider = ThemeProvider();
      await Future.delayed(const Duration(milliseconds: 10));

      provider.setCustomColor('primaryAccent', const Color(0xFF00FF00));
      final color = provider.getCustomColor('primaryAccent');
      expect(color, isNotNull);
      expect(color!.value, 0xFF00FF00);
    });
  });
}
