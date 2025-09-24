import urllib.parse
import re
from typing import List, Tuple, Optional

def _parse_song_line(line: str) -> Tuple[Optional[str], Optional[str]]:
    """
    Accepts lines like:
      "1. Blinding Lights – The Weeknd"
      "Blinding Lights - The Weeknd"
    Returns (song, artist) or (None, None) if not parseable.
    """
    # Remove a leading number/period if present
    line = re.sub(r"^\s*\d+\s*[\.\)]\s*", "", line).strip()
    if "–" in line:  # en-dash
        parts = line.split("–", 1)
    elif "-" in line:  # hyphen fallback
        parts = line.split("-", 1)
    else:
        return None, None

    song = parts[0].strip()
    artist = parts[1].strip()
    if not song or not artist:
        return None, None
    return song, artist

def _build_url(song: str, artist: str, platform: str = "spotify") -> str:
    """Build search URL for the given song and artist on the specified platform."""
    query = f"{song} {artist}"
    encoded_query = urllib.parse.quote_plus(query)
    if platform.lower() == "spotify":
        return f"https://open.spotify.com/search/{encoded_query}"
    # default to YouTube
    return f"https://www.youtube.com/results?search_query={encoded_query}"

def parse_playlist(playlist_text: str) -> List[dict]:
    """
    Parse playlist text and return a list of song dictionaries.
    Each song dict contains: {'song': str, 'artist': str, 'spotify_url': str, 'youtube_url': str}
    """
    lines = [ln for ln in (playlist_text or "").splitlines() if ln.strip()]
    songs = []
    
    for line in lines:
        song, artist = _parse_song_line(line)
        if song and artist:
            songs.append({
                'song': song,
                'artist': artist,
                'spotify_url': _build_url(song, artist, "spotify"),
                'youtube_url': _build_url(song, artist, "youtube")
            })
    
    return songs

def get_next_song(playlist: List[dict], current_index: int) -> Optional[dict]:
    """Get the next song in the playlist, or None if at the end."""
    if current_index + 1 < len(playlist):
        return playlist[current_index + 1]
    return None

def get_previous_song(playlist: List[dict], current_index: int) -> Optional[dict]:
    """Get the previous song in the playlist, or None if at the beginning."""
    if current_index > 0:
        return playlist[current_index - 1]
    return None
