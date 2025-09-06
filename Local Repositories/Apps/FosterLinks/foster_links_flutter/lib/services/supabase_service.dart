import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseConfig {
  static const String supabaseUrl = 'https://zieocnjoafqqijytbmnw.supabase.co';
  static const String supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZW9jbmpvYWZxcWlqeXRibW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDIyOTAsImV4cCI6MjA3MjcxODI5MH0.wEdptgXojgjFmptQLJ2BLUkweplCTV23AnQLF6OFfDc';

  static Future<void> initialize() async {
    await Supabase.initialize(
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    );
  }

  static SupabaseClient get client => Supabase.instance.client;
}
