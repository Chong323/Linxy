import json
from pathlib import Path
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


async def get_soul() -> str:
    return await read_file(BASE_MEM_DIR / "soul.md")


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
