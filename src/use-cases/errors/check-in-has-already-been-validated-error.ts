export class CheckInHasAlreadyBeenValidatedError extends Error {
	constructor() {
		super('This check-in has already been validated.')
	}
}
