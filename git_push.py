#!/usr/bin/env python3
import os
import subprocess
import sys

# The project root directory
project_dir = os.path.dirname(os.path.abspath(__file__))

def run_git_command(args, cwd=None):
    """Run a git command and return output"""
    if cwd is None:
        cwd = project_dir
    
    try:
        result = subprocess.run(
            args,
            cwd=cwd,
            capture_output=True,
            text=True
        )
        print(f"\n>>> {' '.join(args)}")
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print(f"STDERR: {result.stderr}")
        return result.returncode
    except Exception as e:
        print(f"Error: {e}")
        return 1

print(f"Project directory: {project_dir}")
print(f"Directory exists: {os.path.isdir(project_dir)}")

# Git commands to execute
commands = [
    ['git', 'status'],
    ['git', 'add', '.'],
    ['git', 'commit', '-m', 'Initial commit'],
    ['git', 'branch', '-M', 'main'],
]

for cmd in commands:
    code = run_git_command(cmd)
    if code != 0 and 'commit' in cmd:
        print("Commit may have failed or nothing to commit")

# Clean up remote and add new one
print("\n" + "="*60)
run_git_command(['git', 'remote', 'remove', 'origin'])
run_git_command(['git', 'remote', 'add', 'origin', 'https://github.com/expertluma/flightpricetracker.git'])

# Verify setup
print("\n" + "="*60)
print("FINAL STATUS")
print("="*60)
run_git_command(['git', 'remote', '-v'])
run_git_command(['git', 'log', '--oneline', '-n', '1'])

# Try to push
print("\n" + "="*60)
print("PUSHING TO GITHUB...")
print("="*60)
code = run_git_command(['git', 'push', '-u', 'origin', 'main'])
if code == 0:
    print("\n✓ Successfully pushed to GitHub!")
else:
    print("\n✗ Push failed - check authentication and try again")
