import json
from pathlib import Path
from datetime import datetime
import aiofiles

# MVP setup: local file system
BASE_MEM_DIR = Path("data/users/mock_user/memory")


async def read_file(path: Path) -> str:
    if not path.exists():
        return ""
    async with aiofiles.open(path, mode="r") as f:
        return await f.read()


async def write_file(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    async with aiofiles.open(path, mode="w") as f:
        await f.write(content)


async def get_identity() -> str:
    return await read_file(BASE_MEM_DIR / "identity.md")


async def get_current_state() -> str:
    return await read_file(BASE_MEM_DIR / "current_state.md")


async def write_current_state(content: str) -> None:
    await write_file(BASE_MEM_DIR / "current_state.md", content)


async def get_long_term_summary() -> str:
    return await read_file(BASE_MEM_DIR / "long_term_summary.md")


async def write_long_term_summary(content: str) -> None:
    await write_file(BASE_MEM_DIR / "long_term_summary.md", content)


async def get_core_instructions() -> str:
    return await read_file(BASE_MEM_DIR / "core_instructions.md")


async def add_core_instruction(instruction: str) -> None:
    current = await get_core_instructions()
    new_content = f"{current}\n- {instruction}".strip()
    await write_file(BASE_MEM_DIR / "core_instructions.md", new_content)


async def get_episodic_memory() -> list:
    path = BASE_MEM_DIR / "episodic_memory.json"
    if not path.exists():
        return []
    async with aiofiles.open(path, mode="r") as f:
        content = await f.read()
        return json.loads(content) if content else []


async def write_episodic_memory(memory_list: list) -> None:
    path = BASE_MEM_DIR / "episodic_memory.json"
    await write_file(path, json.dumps(memory_list, indent=2))


async def add_episodic_memory(memory_item: dict) -> None:
    current_memories = await get_episodic_memory()
    current_memories.append(memory_item)
    await write_episodic_memory(current_memories)


async def get_rewards() -> list[dict]:
    path = BASE_MEM_DIR / "rewards.json"
    if not path.exists():
        return []
    async with aiofiles.open(path, mode="r") as f:
        content = await f.read()
        return json.loads(content) if content else []


async def add_reward(sticker: str, reason: str) -> None:
    current_rewards = await get_rewards()
    reward_item = {
        "sticker": sticker,
        "reason": reason,
        "timestamp": datetime.now().isoformat(),
    }
    current_rewards.append(reward_item)
    path = BASE_MEM_DIR / "rewards.json"
    await write_file(path, json.dumps(current_rewards, indent=2))


async def get_parent_reports() -> list:
    path = BASE_MEM_DIR / "parent_reports.json"
    if not path.exists():
        return []
    async with aiofiles.open(path, mode="r") as f:
        content = await f.read()
        return json.loads(content) if content else []


async def add_parent_report(report: dict) -> None:
    current_reports = await get_parent_reports()
    current_reports.append(report)
    path = BASE_MEM_DIR / "parent_reports.json"
    await write_file(path, json.dumps(current_reports, indent=2))
