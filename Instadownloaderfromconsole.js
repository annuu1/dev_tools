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
  "https://www.instagram.com/mimar.models/reel/DM2s6Nev6cn/",
  "https://www.instagram.com/mimar.models/reel/DMvBImSPkaY/",
  "https://www.instagram.com/mimar.models/reel/DMiKRPwPS-y/",
  "https://www.instagram.com/mimar.models/reel/DMSuOy_vMNB/",
  "https://www.instagram.com/mimar.models/reel/DMK9FoWPafL/",
  "https://www.instagram.com/mimar.models/reel/DL-SgynPRKE/",
  "https://www.instagram.com/mimar.models/reel/DLupX4CPL4v/",
  "https://www.instagram.com/mimar.models/reel/DLkVlCJPmHn/",
  "https://www.instagram.com/mimar.models/reel/DLcnH_jv9Cx/",
  "https://www.instagram.com/mimar.models/reel/DLH_eRBPTgP/",
  "https://www.instagram.com/mimar.models/reel/DK2M_BjP6cT/",
  "https://www.instagram.com/mimar.models/p/DKi_E7JvZNk/",
  "https://www.instagram.com/mimar.models/reel/DKcdPmTvkFN/",
  "https://www.instagram.com/mimar.models/reel/DKPeJPCPiM_/",
  "https://www.instagram.com/mimar.models/reel/DKKUeCqvy7Z/",
  "https://www.instagram.com/mimar.models/reel/DJ9Vjb8PnjV/",
  "https://www.instagram.com/mimar.models/reel/DJ4BxP9Pgzl/",
  "https://www.instagram.com/mimar.models/reel/DJyMlfQu3Nk/",
  "https://www.instagram.com/mimar.modelseg/reel/DJrbAo5Cm5J/",
  "https://www.instagram.com/mimar.models/reel/DJrP9uyPGqU/",
  "https://www.instagram.com/mimar.models/reel/DJbxvD2PMy7/",
  "https://www.instagram.com/mimar.models/reel/DJJvgNLP6BF/",
  "https://www.instagram.com/mimar.models/reel/DI3uyzePe0W/",
  "https://www.instagram.com/mimar.models/reel/DIl9FeXPsRm/",
  "https://www.instagram.com/mimar.models/reel/DId-U-mPe0j/",
  "https://www.instagram.com/mimar.models/p/DHz53_2PL5X/",
  "https://www.instagram.com/mimar.models/p/DHyrbrmzS34/",
  "https://www.instagram.com/mimar.models/reel/DG8RvksPTFx/",
  "https://www.instagram.com/mimar.models/p/DGpyF9Mvru2/",
  "https://www.instagram.com/mimar.models/reel/DGincucJqKP/",
  "https://www.instagram.com/mimar.models/reel/DGZ4tJevIF9/",
  "https://www.instagram.com/mimar.models/reel/DGN-uy0PMXk/",
  "https://www.instagram.com/mimar.models/reel/DGDqk-pPeOm/",
  "https://www.instagram.com/mimar.models/reel/DF0MAEFPPz2/",
  "https://www.instagram.com/mimar.models/reel/DFiJOeEPH4A/",
  "https://www.instagram.com/mimar.models/reel/DFX02MZPSZk/",
  "https://www.instagram.com/mimar.models/reel/DFQFHt7vHz2/",
  "https://www.instagram.com/mimar.models/reel/DFLDktnPgR2/",
  "https://www.instagram.com/mimar.models/reel/DFH6cYNve4o/",
  "https://www.instagram.com/mimar.models/reel/DE7SqKBvVHl/",
  "https://www.instagram.com/mimar.models/p/DEPwZmTv1ad/",
  "https://www.instagram.com/mimar.models/p/DD_TDpRvCWG/",
  "https://www.instagram.com/mimar.models/reel/DD19HNQvjnt/",
  "https://www.instagram.com/mimar.models/p/DDEhAp5P2PU/",
  "https://www.instagram.com/mimar.models/reel/DCMaG97vsn3/",
  "https://www.instagram.com/mimar.models/reel/C40CnbqLiv9/",
  "https://www.instagram.com/mimar.models/p/C4Wr7kfvrZG/",
  "https://www.instagram.com/mimar.models/reel/C35dd-cPjmn/",
  "https://www.instagram.com/mimar.models/reel/C32fpDrvSl4/",
  "https://www.instagram.com/mimar.models/reel/C3IHk2bvT-_/",
  "https://www.instagram.com/mimar.models/p/C2_4krxrKGL/",
  "https://www.instagram.com/mimar.models/reel/C25ohF8B9Eq/",
  "https://www.instagram.com/mimar.models/p/C21Y2fQvDTN/",
  "https://www.instagram.com/mimar.models/p/C2NDfFDPp66/",
  "https://www.instagram.com/mimar.models/reel/C1ur1E_vpcI/",
  "https://www.instagram.com/mimar.models/p/C1gTA15LXg4/",
  "https://www.instagram.com/mimar.models/p/C1bu0CNPuyA/",
  "https://www.instagram.com/mimar.models/reel/C1XOFmUR8mg/",
  "https://www.instagram.com/mimar.models/p/C1PdXOxvDCS/",
  "https://www.instagram.com/mimar.models/reel/C0_7KEqPxcH/",
  "https://www.instagram.com/mimar.models/reel/C0mgsg4v3CT/",
  "https://www.instagram.com/mimar.models/reel/C0jrUF9ufSp/",
  "https://www.instagram.com/mimar.models/p/C0U-VR0yx4T/",
  "https://www.instagram.com/mimar.models/reel/C0O7fO2LDXR/",
  "https://www.instagram.com/mimar.models/reel/Cz7xzJGr78T/",
  "https://www.instagram.com/mimar.models/reel/Czq98ugv4sd/",
  "https://www.instagram.com/mimar.models/reel/Czojmebv_mM/",
  "https://www.instagram.com/mimar.models/reel/CzYu8RCPE3m/",
  "https://www.instagram.com/mimar.models/reel/CzLqbonvDTT/",
  "https://www.instagram.com/mimar.models/p/Cy5ltLsvCav/",
  "https://www.instagram.com/mimar.models/reel/CyXeCNeLPq_/",
  "https://www.instagram.com/mimar.models/reel/CyP9d6TJODK/",
  "https://www.instagram.com/mimar.models/reel/CyBrpoevyJ2/",
  "https://www.instagram.com/mimar.models/reel/CxkZnBFL_xn/",
  "https://www.instagram.com/mimar.models/reel/Cxhdj71LaCx/",
  "https://www.instagram.com/mimar.models/reel/CxhPh87rbms/",
  "https://www.instagram.com/mimar.models/reel/CxVlhCBviqN/",
  "https://www.instagram.com/mimar.models/reel/CxGEoitvKV-/",
  "https://www.instagram.com/mimar.models/reel/CxAzHDVsgCZ/",
  "https://www.instagram.com/mimar.models/reel/Cw2dUQ8PvMe/",
  "https://www.instagram.com/mimar.models/reel/CwcxSIoBokj/",
  "https://www.instagram.com/mimar.models/reel/CwZ8zZuhEgR/",
  "https://www.instagram.com/mimar.models/reel/CwVYBtuhuFO/",
  "https://www.instagram.com/mimar.models/reel/CwS8e0qhKjC/",
  "https://www.instagram.com/mimar.models/reel/CwS6BtRhEDQ/",
  "https://www.instagram.com/mimar.models/reel/CwQAigCBjjH/",
  "https://www.instagram.com/mimar.models/reel/CwNxequhLJ3/",
  "https://www.instagram.com/mimar.models/reel/CwNm5idhjK4/",
  "https://www.instagram.com/mimar.models/reel/CwHGjNVBSuR/",
  "https://www.instagram.com/mimar.models/reel/CwGHMolhjwE/",
  "https://www.instagram.com/mimar.models/reel/CwFhveFh0Jc/",
  "https://www.instagram.com/mimar.models/reel/CwC2UihBA5h/",
  "https://www.instagram.com/mimar.models/reel/Cv-IMdPsPNa/",
  "https://www.instagram.com/mimar.models/reel/Cv9ax4ixVg5/",
  "https://www.instagram.com/mimar.models/reel/CvzA0Oag65j/",
  "https://www.instagram.com/mimar.models/reel/Cvj66IkvwPo/",
  "https://www.instagram.com/mimar.models/reel/CvPg392vinL/",
  "https://www.instagram.com/mimar.models/reel/CvJzILULamk/",
  "https://www.instagram.com/mimar.models/reel/CvJlLecsKgL/",
  "https://www.instagram.com/mimar.models/reel/Cu1VMP2OSEm/",
  "https://www.instagram.com/mimar.models/reel/Cum6eNlsBOP/",
  "https://www.instagram.com/mimar.models/p/Ct_7slev8g3/",
  "https://www.instagram.com/mimar.models/reel/CtvJccSrgD3/",
  "https://www.instagram.com/mimar.models/reel/CtYbr9PrvEk/",
  "https://www.instagram.com/mimar.models/reel/CtRgb8Duxjy/",
  "https://www.instagram.com/mimar.models/p/CpXsHN-PkKI/",
  "https://www.instagram.com/mimar.models/reel/CpVZaSXM-4l/",
  "https://www.instagram.com/mimar.models/p/CpVVEICPNqy/",
  "https://www.instagram.com/mimar.models/p/CpSiQVRPOYf/",
  "https://www.instagram.com/mimar.models/reel/CpShvP1MgGT/",
  "https://www.instagram.com/mimar.models/reel/CpIv2ODgcMP/",
  "https://www.instagram.com/mimar.models/p/CpIYezcvs3l/",
  "https://www.instagram.com/mimar.models/p/Co-Yhg6PwI2/",
  "https://www.instagram.com/mimar.models/p/Co6VgvUr2xV/",
  "https://www.instagram.com/mimar.models/reel/Coz0X2fhPch/",
  "https://www.instagram.com/mimar.models/reel/CoylbJLBNCr/",
  "https://www.instagram.com/mimar.models/reel/Coum4ughAmY/",
  "https://www.instagram.com/mimar.models/reel/Coop8tABaLY/",
  "https://www.instagram.com/mimar.models/p/CofiQYrB5Jp/",
  "https://www.instagram.com/mimar.models/p/Cofhjv9hU2z/",
  "https://www.instagram.com/mimar.models/reel/CoUyKnZhi2_/",
  "https://www.instagram.com/mimar.models/reel/CoUX_ZPhg6X/",
  "https://www.instagram.com/mimar.models/reel/CoP6m9-hnzB/",
  "https://www.instagram.com/mimar.models/reel/CoKvOgKBM01/",
  "https://www.instagram.com/mimar.models/reel/CoKtxleB8p1/",
  "https://www.instagram.com/mimar.models/p/CoFplhZBvyY/",
  "https://www.instagram.com/mimar.models/p/CoERZDHhqby/",
  "https://www.instagram.com/mimar.models/p/CoDLfy7hxHf/",
  "https://www.instagram.com/mimar.models/reel/CoCW_qJBwWr/",
  "https://www.instagram.com/mimar.models/reel/CoBtxrSBux_/",
  "https://www.instagram.com/mimar.models/p/CoAn_37hcTr/",
  "https://www.instagram.com/mimar.models/p/CoAC4ZvhIey/",
  "https://www.instagram.com/mimar.models/p/CoACT2UhBmM/",
  "https://www.instagram.com/mimar.models/p/Cn95HMfvNDJ/",
  "https://www.instagram.com/mimar.models/reel/Cn91LnDvVBc/",
  "https://www.instagram.com/mimar.models/reel/Cn90QkjuvM6/",
  "https://www.instagram.com/mimar.models/p/Cn4LUVWPIXd/",
  "https://www.instagram.com/mimar.models/reel/Cn2icyHB5DO/",
  "https://www.instagram.com/mimar.models/reel/Cn2h_LFBmaN/",
  "https://www.instagram.com/mimar.models/reel/Cn2hcrphWwi/",
  "https://www.instagram.com/mimar.models/reel/Cn2gr_ZBnv7/",
  "https://www.instagram.com/mimar.models/p/Cn2gU-gh7Iu/",
  "https://www.instagram.com/mimar.models/p/Cn2fll1hcpA/",
  "https://www.instagram.com/mimar.models/p/Cn2d_BaBRLf/",
  "https://www.instagram.com/mimar.models/reel/Cn2dosuhAWg/"
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
