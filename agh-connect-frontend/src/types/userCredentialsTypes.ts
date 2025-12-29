export interface LoginFormData {
	email: string;
	password: string;
}

export interface RegisterFormData extends LoginFormData {
	firstName: string;
	lastName: string;
	acceptTerms: boolean;
}
