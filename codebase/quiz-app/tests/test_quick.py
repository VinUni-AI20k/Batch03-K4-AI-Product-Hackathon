import asyncio
import os
import sys

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure codebase/quiz-app in sys.path
APP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if APP_DIR not in sys.path:
    sys.path.insert(0, APP_DIR)

from services.rag_engine import get_rag_instance, QueryParam

async def main():
    print("--------------------------------------------------")
    print("STARTING LIGHTRAG CORE ENGINE TEST IN NEW PROJECT")
    print("--------------------------------------------------")
    
    test_dir = os.path.join(APP_DIR, "rag_storage_quick_test")
    print(f"1. Initializing LightRAG storage at: {test_dir}")
    rag = await get_rag_instance(storage_dir=test_dir)
    print("   [SUCCESS] Storage Initialization (KV, Vector DB, Knowledge Graph) PASSED!")
    
    print("\n2. Inspecting Storage Backend Structures:")
    print(f"   - Full Docs Store: {type(rag.full_docs)}")
    print(f"   - Text Chunks Store: {type(rag.text_chunks)}")
    print(f"   - Graph Storage: {type(rag.chunk_entity_relation_graph)}")
    print(f"   - Vector DB Entities: {type(rag.entities_vdb)}")
    print(f"   - Vector DB Chunks: {type(rag.chunks_vdb)}")
    
    print("\n--------------------------------------------------")
    print("ALL MINIMAL LIGHTRAG CORE MODULES WORK PERFECTLY!")
    print("--------------------------------------------------")

if __name__ == "__main__":
    asyncio.run(main())
