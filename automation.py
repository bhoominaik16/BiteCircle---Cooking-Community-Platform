import os
import subprocess

def run_command(command):
    print(f"\nRunning: {command}")
    result = subprocess.run(command, shell=True)
    if result.returncode != 0:
        print("Command failed!")
        exit(1)

print("🚀 Starting Automation Script")

run_command("git pull")
run_command("docker compose build")
run_command("docker compose up -d")

print("✅ Deployment Successful!")