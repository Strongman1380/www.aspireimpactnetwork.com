import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          // Drawer header
          _buildDrawerHeader(context),
          
          // Navigation items
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                _buildNavigationItems(context),
              ],
            ),
          ),
          
          // Footer
          _buildDrawerFooter(context),
        ],
      ),
    );
  }

  Widget _buildDrawerHeader(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        final userName = authProvider.userModel?.fullName ?? 'User';
        final userEmail = authProvider.currentUser?.email ?? '';
        final userRole = authProvider.userRole ?? '';
        
        return DrawerHeader(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Theme.of(context).colorScheme.primary,
                Theme.of(context).colorScheme.primary.withAlpha((0.8 * 255).toInt()),
              ],
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // App title
              Text(
                'FosterLinks',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
              
              const SizedBox(height: 16),
              
              // User info
              Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: Colors.white.withAlpha((0.2 * 255).toInt()),
                    child: Text(
                      userName.isNotEmpty ? userName[0].toUpperCase() : 'U',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          userName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                            fontSize: 16,
                          ),
                        ),
                        Text(
                          _getRoleDisplayName(userRole),
                          style: TextStyle(
                            color: Colors.white.withAlpha((0.8 * 255).toInt()),
                            fontSize: 12,
                          ),
                        ),
                        if (userEmail.isNotEmpty)
                          Text(
                            userEmail,
                            style: TextStyle(
                              color: Colors.white.withAlpha((0.7 * 255).toInt()),
                              fontSize: 11,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildNavigationItems(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        final userRole = authProvider.userRole;
        
        return Column(
          children: [
            // Dashboard
            ListTile(
              leading: const Icon(Icons.dashboard),
              title: const Text('Dashboard'),
              onTap: () {
                Navigator.pop(context);
                context.go('/dashboard');
              },
            ),
            
            // Youth Profiles (all roles)
            ListTile(
              leading: const Icon(Icons.child_care),
              title: Text(userRole == 'foster_parent' ? 'My Youth' : 'Youth Profiles'),
              onTap: () {
                Navigator.pop(context);
                if (userRole == 'foster_parent') {
                  context.go('/my-youth');
                } else {
                  context.go('/youth-profiles');
                }
              },
            ),
            
            // Admin-only items
            if (userRole == 'admin') ...[
              ListTile(
                leading: const Icon(Icons.people),
                title: const Text('User Management'),
                onTap: () {
                  Navigator.pop(context);
                  context.go('/user-management');
                },
              ),
              ListTile(
                leading: const Icon(Icons.assessment),
                title: const Text('Reports'),
                onTap: () {
                  Navigator.pop(context);
                  context.go('/reports');
                },
              ),
            ],
            
            // Foster Parents (admin/worker)
            if (userRole == 'admin' || userRole == 'worker')
              ListTile(
                leading: const Icon(Icons.family_restroom),
                title: const Text('Foster Parents'),
                onTap: () {
                  Navigator.pop(context);
                  context.go('/foster-parents');
                },
              ),
            
            // Medication Logs (foster parent)
            if (userRole == 'foster_parent')
              ListTile(
                leading: const Icon(Icons.medication),
                title: const Text('Medication Logs'),
                onTap: () {
                  Navigator.pop(context);
                  context.go('/medication-logs');
                },
              ),
            
            const Divider(),
            
            // Settings
            ListTile(
              leading: const Icon(Icons.settings),
              title: const Text('Settings'),
              onTap: () {
                Navigator.pop(context);
                context.go('/settings');
              },
            ),
          ],
        );
      },
    );
  }

  Widget _buildDrawerFooter(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Logout', style: TextStyle(color: Colors.red)),
            onTap: () async {
              Navigator.pop(context);
              final authProvider = context.read<AuthProvider>();
              await authProvider.signOut();
              if (context.mounted) {
                context.go('/auth/login');
              }
            },
          ),
          const SizedBox(height: 8),
          Text(
            '© ${DateTime.now().year} FosterLinks',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
            ),
          ),
        ],
      ),
    );
  }

  String _getRoleDisplayName(String role) {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'worker':
        return 'Social Worker';
      case 'foster_parent':
        return 'Foster Parent';
      default:
        return 'User';
    }
  }
}