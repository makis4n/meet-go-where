from datetime import datetime, timezone
from fastapi import APIRouter, Query
from typing import Optional
from database import supabase

router = APIRouter()


@router.get("/listings")
def get_listings(
    type: Optional[str] = Query(None, description="food | event | activity"),
    price_max: Optional[int] = Query(None, description="Max price in SGD cents"),
    tags: Optional[str] = Query(None, description="Comma-separated tags"),
):
    q = supabase.table("listings").select("*")

    if type:
        q = q.eq("type", type)

    # Exclude expired events. Keep a listing if:
    #   - it's food (no dates)
    #   - ends_at is in the future (SGCP events)
    #   - ends_at is null but starts_at is in the future (Eventbrite single-day events)
    #   - both dates are null (undated listings)
    now = datetime.now(timezone.utc).isoformat()
    q = q.or_(
        f"type.eq.food"
        f",ends_at.gte.{now}"
        f",and(ends_at.is.null,starts_at.gte.{now})"
        f",and(ends_at.is.null,starts_at.is.null)"
    )

    if price_max is not None:
        q = q.or_(f"price_min.is.null,price_min.lte.{price_max}")

    if tags:
        tag_list = [t.strip() for t in tags.split(",") if t.strip()]
        if tag_list:
            q = q.contains("tags", tag_list)

    return q.execute().data
