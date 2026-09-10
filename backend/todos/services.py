from users.schemas import TodosBase, UserBase, UserLogin
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from db.models import Users, Todos


async def create_todos(session: AsyncSession, todo: TodosBase, user_id: int):
    existingTodo = select(Todos).where(func.lower(Todos.title) == todo.title.lower())
    result = await session.execute(existingTodo)
    existing_todo = result.first()
    if existing_todo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Todo with this title already exists Please update existing todo or create a new one with a different title",
        )
    new_todo = Todos(
        title=todo.title,
        description=todo.description,
        is_complete=todo.is_complete,
        user_id=user_id,
    )

    session.add(new_todo)
    await session.commit()
    await session.refresh(new_todo)
    return new_todo


async def get_todo_by_user(session: AsyncSession, user_id: int):
    getTodos = select(Todos).where(Todos.user_id == user_id)
    result = await session.execute(getTodos)
    todos = result.scalars().all()
    return todos


async def edit_todo(
    session: AsyncSession, todo_id: int, updated_todo: TodosBase, user_id: int
):
    stmt = select(Todos).where(Todos.id == todo_id, Todos.user_id == user_id)
    result = await session.execute(stmt)
    todoItem = result.scalar_one_or_none()
    if not todoItem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found",
        )
    
    todoItem.title = updated_todo.title
    todoItem.description = updated_todo.description
    todoItem.is_complete = updated_todo.is_complete
    

    await session.commit()
    await session.refresh(todoItem)
    return todoItem

async def delete_todos(session: AsyncSession, todo_id: int, user_id: int):
    stmt = select(Todos).where(Todos.id == todo_id, Todos.user_id == user_id)
    result = await session.execute(stmt)
    todoItem = result.scalar_one_or_none()
    if not todoItem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found",
        )
    await session.delete(todoItem)
    await session.commit()
    return {"message": "Todo deleted successfully"}