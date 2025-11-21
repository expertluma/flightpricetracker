import os
import subprocess
import sys

# Change to project directory
proj_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(proj_dir)
print(f"Working directory: {os.getcwd()}")

commands = [
    ['git', 'add', '.'],
    ['git', 'commit', '-m', 'Initial commit'],
    ['git', 'branch', '-M', 'main'],
    ['git', 'remote', 'remove', 'origin'],
    ['git', 'remote', 'add', 'origin', 'https://github.com/expertluma/flightpricetracker.git'],
    ['git', 'push', '-u', 'origin', 'main']
]

for cmd in commands:
    print(f"\n{'='*60}")
    print(f"Running: {' '.join(cmd)}")
    print(f"{'='*60}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr)
    print(f"Return code: {result.returncode}")
    if result.returncode != 0 and 'remove' not in cmd[0]:  # Allow remove to fail if origin doesn't exist
        print(f"Error running command!")
        if 'remove' not in ' '.join(cmd):
            sys.exit(1)

print("\n" + "="*60)
print("Verifying...")
print("="*60)
result = subprocess.run(['git', 'log', '--oneline', '-1'], capture_output=True, text=True)
print("Latest commit:")
print(result.stdout)

result = subprocess.run(['git', 'remote', '-v'], capture_output=True, text=True)
print("\nRemotes:")
print(result.stdout)
