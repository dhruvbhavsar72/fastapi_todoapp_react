import re
from pydantic import BaseModel , Field

class TodosBase(BaseModel):
    title: str = Field(..., example="Buy groceries")
    description: str = Field(..., example="Milk, Bread, Eggs")
    is_complete: bool = False