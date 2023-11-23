export const isValidUsername = (username: string) => {
	if (!username || username.length > 32) return false
	return true
}
