import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/dashboard/dashboard_screen.dart';
import '../screens/youth/youth_profiles_screen.dart';
import '../screens/youth/youth_detail_screen.dart';
import '../screens/settings/settings_screen.dart';
import '../widgets/loading_screen.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/',
    redirect: (BuildContext context, GoRouterState state) {
      final authProvider = context.read<AuthProvider>();
      
      // Show loading screen while checking auth state
      if (authProvider.loading) {
        return null; // Let the loading screen handle this
      }
      
      final isAuthenticated = authProvider.isAuthenticated;
      final isOnAuthPage = state.matchedLocation.startsWith('/auth');
      
      // Redirect to login if not authenticated and not on auth page
      if (!isAuthenticated && !isOnAuthPage) {
        return '/auth/login';
      }
      
      // Redirect to dashboard if authenticated and on auth page
      if (isAuthenticated && isOnAuthPage) {
        return '/dashboard';
      }
      
      return null; // No redirect needed
    },
    routes: [
      // Root route - shows loading or redirects
      GoRoute(
        path: '/',
        builder: (context, state) {
          return Consumer<AuthProvider>(
            builder: (context, authProvider, child) {
              if (authProvider.loading) {
                return const LoadingScreen();
              }
              
              if (authProvider.isAuthenticated) {
                return const DashboardScreen();
              }
              
              return const LoginScreen();
            },
          );
        },
      ),
      
      // Auth routes
      GoRoute(
        path: '/auth/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/auth/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      
      // Main app routes
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => const DashboardScreen(),
      ),
      
      // Youth routes
      GoRoute(
        path: '/youth-profiles',
        builder: (context, state) => const YouthProfilesScreen(),
      ),
      GoRoute(
        path: '/youth/:id',
        builder: (context, state) {
          final youthId = state.pathParameters['id']!;
          return YouthDetailScreen(youthId: youthId);
        },
      ),
      
      // Settings routes
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      
      // User management (admin only)
      GoRoute(
        path: '/user-management',
        builder: (context, state) => const Scaffold(
          body: Center(
            child: Text('User Management - Coming Soon'),
          ),
        ),
      ),
      
      // Foster parents (admin/worker)
      GoRoute(
        path: '/foster-parents',
        builder: (context, state) => const Scaffold(
          body: Center(
            child: Text('Foster Parents - Coming Soon'),
          ),
        ),
      ),
      
      // Reports
      GoRoute(
        path: '/reports',
        builder: (context, state) => const Scaffold(
          body: Center(
            child: Text('Reports - Coming Soon'),
          ),
        ),
      ),
      
      // My youth (foster parent specific)
      GoRoute(
        path: '/my-youth',
        builder: (context, state) => const YouthProfilesScreen(showOnlyAssigned: true),
      ),
      
      // Medication logs
      GoRoute(
        path: '/medication-logs',
        builder: (context, state) => const Scaffold(
          body: Center(
            child: Text('Medication Logs - Coming Soon'),
          ),
        ),
      ),
    ],
    
    errorBuilder: (context, state) => Scaffold(
      appBar: AppBar(title: const Text('Page Not Found')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.grey),
            const SizedBox(height: 16),
            Text(
              'Page not found: ${state.matchedLocation}',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => context.go('/dashboard'),
              child: const Text('Go to Dashboard'),
            ),
          ],
        ),
      ),
    ),
  );
}