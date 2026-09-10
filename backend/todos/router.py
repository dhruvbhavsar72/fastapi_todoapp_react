from fastapi import APIRouter, Depends
from utils import get_current_user
from todos.services import create_todos, delete_todos, edit_todo, get_todo_by_user
from db.config import SessionDep
from todos.schemas import TodosBase

router = APIRouter()


@router.post("/create-todos")
async def new_todo(
    session: SessionDep, todos: TodosBase, current_user=Depends(get_current_user)
):
    return await create_todos(session, todos, current_user.id)


@router.put("/update-Item/{todo_id}")
async def update_item(session: SessionDep, todo_id: int, todos: TodosBase,current_user=Depends(get_current_user)):
    return await edit_todo(session, todo_id, todos, current_user.id)


@router.delete("/delete-Item/{todo_id}")
async def delete_item(session: SessionDep, todo_id: int, current_user=Depends(get_current_user)):
    return await delete_todos(session, todo_id, current_user.id)


@router.get("/todos/me")
async def user_todos(session: SessionDep, current_user=Depends(get_current_user)):
    return await get_todo_by_user(session, current_user.id)
