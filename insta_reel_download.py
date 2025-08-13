import sys
import re
import instaloader
import getpass
import os

# Hardcoded list of reel URLs as a global variable - edit this list with your array of URLs
REEL_URLS = [
  "https://www.instagram.com/mimar.models/reel/DGH3lk2P34B/",
  "https://www.instagram.com/mimar.models/reel/DNIv70Fvml_/",
  "https://www.instagram.com/mimar.models/reel/DNA9CmeP_Et/",
]

# Extract shortcode from Instagram URLs like:
# https://www.instagram.com/<username>/reel/SHORTCODE/ or https://www.instagram.com/<username>/p/SHORTCODE/
SHORTCODE_RE = re.compile(r"instagram\.com/[^/]+/(?:reel|p)/([^/?#]+)/?")

def extract_shortcode(url: str) -> str:
    m = SHORTCODE_RE.search(url)
    if not m:
        raise ValueError(f"Could not extract shortcode from URL: {url}")
    return m.group(1)

def download_reel(L: instaloader.Instaloader, url: str):
    try:
        shortcode = extract_shortcode(url)
        post = instaloader.Post.from_shortcode(L.context, shortcode)
        # Download to a folder named after the profile
        L.download_post(post, target=f"{post.owner_username}_reels")
        print(f"Successfully downloaded reel to {post.owner_username}_reels from {url}")
    except instaloader.exceptions.PostChangedException:
        print(f"Error: The post content has changed or is unavailable for {url}")
    except instaloader.exceptions.LoginRequiredException:
        print(f"Error: Login required to access this post for {url}. Ensure the account has permission.")
    except instaloader.exceptions.InstaloaderException as e:
        print(f"Instaloader error for {url}: {e}")

if __name__ == "__main__":
    if not REEL_URLS:
        print("Error: Add at least one reel URL to the global REEL_URLS list in the script.")
        sys.exit(1)
    
    # Optional username as command-line argument for login
    username = sys.argv[1] if len(sys.argv) > 1 else None
    
    L = instaloader.Instaloader(save_metadata=True, download_comments=False)
    
    # Handle login only once if username is provided
    session_file = f"{username}_session" if username else None
    if username:
        # Clear any existing session file to avoid stale session issues
        if session_file and os.path.exists(session_file):
            os.remove(session_file)
            print(f"Removed stale session file: {session_file}")
        
        try:
            password = getpass.getpass("Password: ")
            L.login(username, password)
            print(f"Successfully logged in as {username}")
        except instaloader.exceptions.TwoFactorAuthRequiredException:
            two_factor_code = input("Enter 2FA code: ")
            L.two_factor_login(two_factor_code)
            print(f"Successfully logged in with 2FA as {username}")
        except instaloader.exceptions.BadCredentialsException:
            print("Error: Invalid username or password")
            sys.exit(1)
        except instaloader.exceptions.ConnectionException as e:
            print(f"Error: Connection issue during login: {e}")
            sys.exit(1)
    
    # Download each reel one by one using the same Instaloader instance
    for url in REEL_URLS:
        download_reel(L, url)
