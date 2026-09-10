import pytest
from httpx import AsyncClient


pytestmark = pytest.mark.asyncio


async def register_and_login(client: AsyncClient, username: str) -> None:
    response = await client.post(
        "/register",
        json={
            "first_name": "Test",
            "last_name": "User",
            "email": f"{username}@example.com",
            "user_name": username,
            "password": "Password1!",
            "phone_no": "1234567890",
        },
    )
    assert response.status_code == 200

    response = await client.post(
        "/login",
        json={"user_name": username, "password": "Password1!"},
    )
    assert response.status_code == 200
    assert "access_token" in response.headers.get("set-cookie", "")
    assert "refresh_token" in response.headers.get("set-cookie", "")


async def test_root_returns_welcome_message(client: AsyncClient):
    response = await client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the TodoApp API!"}


async def test_register_login_and_current_user(client: AsyncClient):
    await register_and_login(client, "authuser")

    response = await client.get("/me")

    assert response.status_code == 200
    assert response.json()["user_name"] == "authuser"


async def test_login_rejects_invalid_password(client: AsyncClient):
    await client.post(
        "/register",
        json={
            "first_name": "Test",
            "last_name": "User",
            "email": "wrong-password@example.com",
            "user_name": "wrongpassword",
            "password": "Password1!",
            "phone_no": "1234567890",
        },
    )

    response = await client.post(
        "/login",
        json={"user_name": "wrongpassword", "password": "Wrongpass1!"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect password"


async def test_todo_crud_requires_authentication(client: AsyncClient):
    response = await client.get("/todos/me")

    assert response.status_code == 401


async def test_authenticated_user_can_create_update_and_delete_todo(
    client: AsyncClient,
):
    await register_and_login(client, "todouser")

    response = await client.post(
        "/create-todos",
        json={
            "title": "Write tests",
            "description": "Cover the API",
            "is_complete": False,
        },
    )
    assert response.status_code == 200
    todo_id = response.json()["id"]

    response = await client.get("/todos/me")
    assert response.status_code == 200
    assert response.json()[0]["title"] == "Write tests"

    response = await client.put(
        f"/update-Item/{todo_id}",
        json={
            "title": "Write complete tests",
            "description": "Cover every important API flow",
            "is_complete": True,
        },
    )
    assert response.status_code == 200
    assert response.json()["is_complete"] is True

    response = await client.delete(f"/delete-Item/{todo_id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Todo deleted successfully"}

    response = await client.get("/todos/me")
    assert response.status_code == 200
    assert response.json() == []


async def test_user_cannot_update_or_delete_another_users_todo(
    client: AsyncClient,
):
    await register_and_login(client, "firstuser")
    response = await client.post(
        "/create-todos",
        json={
            "title": "Private todo",
            "description": "Only the owner can change this",
            "is_complete": False,
        },
    )
    todo_id = response.json()["id"]

    await client.post("/logout")
    await register_and_login(client, "seconduser")

    response = await client.put(
        f"/update-Item/{todo_id}",
        json={
            "title": "Changed by another user",
            "description": "This must fail",
            "is_complete": True,
        },
    )
    assert response.status_code == 404

    response = await client.delete(f"/delete-Item/{todo_id}")
    assert response.status_code == 404
