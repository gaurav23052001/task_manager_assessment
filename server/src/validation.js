

const MAX_TITLE = 200;
const MAX_DESCRIPTION = 2000;

function isValidDate(value) {
  return !Number.isNaN(new Date(value).getTime());
}

export function validateCreate(body = {}) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) return { error: 'Title is required.' };
  if (title.length > MAX_TITLE) {
    return { error: `Title must be ${MAX_TITLE} characters or fewer.` };
  }

  const description = body.description ?? '';
  if (typeof description !== 'string' || description.length > MAX_DESCRIPTION) {
    return { error: `Description must be ${MAX_DESCRIPTION} characters or fewer.` };
  }

  let dueDate = body.dueDate ?? null;
  if (dueDate !== null && dueDate !== '') {
    if (typeof dueDate !== 'string' || !isValidDate(dueDate)) {
      return { error: 'Due date must be a valid date.' };
    }
  } else {
    dueDate = null;
  }

  return { value: { title, description: description.trim(), dueDate } };
}

/** Validate a partial update. Only validates fields that are present. */
export function validateUpdate(body = {}) {
  const changes = {};

  if ('title' in body) {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) return { error: 'Title cannot be empty.' };
    if (title.length > MAX_TITLE) {
      return { error: `Title must be ${MAX_TITLE} characters or fewer.` };
    }
    changes.title = title;
  }

  if ('description' in body) {
    const description = body.description ?? '';
    if (typeof description !== 'string' || description.length > MAX_DESCRIPTION) {
      return { error: `Description must be ${MAX_DESCRIPTION} characters or fewer.` };
    }
    changes.description = description.trim();
  }

  if ('dueDate' in body) {
    const dueDate = body.dueDate;
    if (dueDate === null || dueDate === '') {
      changes.dueDate = null;
    } else if (typeof dueDate !== 'string' || !isValidDate(dueDate)) {
      return { error: 'Due date must be a valid date.' };
    } else {
      changes.dueDate = dueDate;
    }
  }

  if ('completed' in body) {
    if (typeof body.completed !== 'boolean') {
      return { error: 'Completed must be a boolean.' };
    }
    changes.completed = body.completed;
  }

  if (Object.keys(changes).length === 0) {
    return { error: 'No valid fields to update.' };
  }

  return { value: changes };
}
