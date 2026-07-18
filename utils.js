export function showLoading(button, text = "Saving...") {
    button.disabled = true;
    button.innerText = text;
}

export function hideLoading(button, text = "Save Changes") {
    button.disabled = false;
    button.innerText = text;
}