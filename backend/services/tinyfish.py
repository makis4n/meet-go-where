import httpx
import json
import os
from typing import Any

TINYFISH_API_KEY = os.environ.get("TINYFISH_API_KEY")
BASE_URL = "https://agent.tinyfish.ai"


async def run_automation(
    url: str,
    goal: str,
    browser_profile: str = "lite",
) -> Any:
    """
    Runs a TinyFish SSE automation and blocks until the COMPLETE event.
    Returns the result payload, or raises on failure.
    """
    headers = {
        "X-API-Key": TINYFISH_API_KEY,
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
    }
    body = {"url": url, "goal": goal, "browser_profile": browser_profile}

    async with httpx.AsyncClient(timeout=180.0) as client:
        async with client.stream(
            "POST",
            f"{BASE_URL}/v1/automation/run-sse",
            headers=headers,
            json=body,
        ) as resp:
            resp.raise_for_status()
            async for line in resp.aiter_lines():
                if not line.startswith("data:"):
                    continue
                event = json.loads(line[5:].strip())
                if event.get("type") == "COMPLETE":
                    if event.get("status") == "COMPLETED":
                        return event.get("result")
                    raise RuntimeError(
                        f"TinyFish run failed: {event.get('error', 'unknown error')}"
                    )

    raise RuntimeError("SSE stream ended without a COMPLETE event")
