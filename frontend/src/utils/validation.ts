export const isValidAghEmail = (email: string): boolean => {
	const regex = /^[a-zA-Z0-9._%+-]+@student\.agh\.edu\.pl$/;
	return regex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
	if (password.length < 8) {
		return { isValid: false, message: 'Hasło musi mieć co najmniej 8 znaków' };
	}

	if (!/[A-Z]/.test(password)) {
		return { isValid: false, message: 'Hasło musi zawierać co najmniej jedną wielką literę' };
	}

	if (!/[0-9]/.test(password)) {
		return { isValid: false, message: 'Hasło musi zawierać co najmniej jedną cyfrę' };
	}

	return { isValid: true };
};
