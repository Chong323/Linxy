from typing import Any
from datetime import datetime
from services.supabase_client import get_supabase_client

async def read_db_field(user_id: str, field: str, default: Any = "") -> Any:
    client = get_supabase_client()
    try:
        response = client.table("memories").select(field).eq("user_id", user_id).execute()
        if response.data and len(response.data) > 0:
            item = response.data[0]
            if isinstance(item, dict):
                return item.get(field, default)
            return default
    except Exception:
        pass
    return default

async def write_db_field(user_id: str, field: str, value: Any) -> None:
    client = get_supabase_client()
    data = {"user_id": user_id, field: value}
    client.table("memories").upsert(data).execute()

async def get_identity(user_id: str) -> str:
    return await read_db_field(user_id, "identity", "")

async def get_current_state(user_id: str) -> str:
    return await read_db_field(user_id, "current_state", "")

async def write_current_state(user_id: str, content: str) -> None:
    await write_db_field(user_id, "current_state", content)

async def get_long_term_summary(user_id: str) -> str:
    return await read_db_field(user_id, "long_term_summary", "")

async def write_long_term_summary(user_id: str, content: str) -> None:
    await write_db_field(user_id, "long_term_summary", content)

async def get_core_instructions(user_id: str) -> list:
    res = await read_db_field(user_id, "core_instructions", [])
    if not isinstance(res, list):
        return []
    return res

async def add_core_instruction(user_id: str, instruction: str) -> None:
    current = await get_core_instructions(user_id)
    # the core_instructions is JSONB but the original code treated it as string
    # Let's keep it consistent with the schema which says JSONB DEFAULT '[]'
    if not isinstance(current, list):
        current = []
    current.append(instruction)
    await write_db_field(user_id, "core_instructions", current)

async def get_episodic_memory(user_id: str) -> list:
    res = await read_db_field(user_id, "episodic_memory", [])
    if not isinstance(res, list):
        return []
    return res

async def write_episodic_memory(user_id: str, memory_list: list) -> None:
    await write_db_field(user_id, "episodic_memory", memory_list)

async def add_episodic_memory(user_id: str, memory_item: dict) -> None:
    current_memories = await get_episodic_memory(user_id)
    current_memories.append(memory_item)
    await write_episodic_memory(user_id, current_memories)

async def get_rewards(user_id: str) -> list[dict]:
    res = await read_db_field(user_id, "rewards", [])
    if not isinstance(res, list):
        return []
    return res

async def add_reward(user_id: str, sticker: str, reason: str) -> None:
    current_rewards = await get_rewards(user_id)
    reward_item = {
        "sticker": sticker,
        "reason": reason,
        "timestamp": datetime.now().isoformat(),
    }
    current_rewards.append(reward_item)
    await write_db_field(user_id, "rewards", current_rewards)

async def get_parent_reports(user_id: str) -> list:
    res = await read_db_field(user_id, "parent_reports", [])
    if not isinstance(res, list):
        return []
    return res

async def add_parent_report(user_id: str, report: dict) -> None:
    current_reports = await get_parent_reports(user_id)
    current_reports.append(report)
    await write_db_field(user_id, "parent_reports", current_reports)