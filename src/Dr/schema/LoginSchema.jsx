import * as zod from "zod"
export const loginSchema = zod.object({
    email: zod.string()
        .nonempty("Email is required")
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
    password: zod.string()
        .nonempty("Password is required")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, "password must be Minimum eight characters, at least one letter, one number and one special character"),
})
