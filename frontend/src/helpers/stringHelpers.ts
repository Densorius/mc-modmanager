export const stringIsEmpty = (str: string) => {
    if (str) {
        return str.trim() ? false : true;
    }

    return true;
}