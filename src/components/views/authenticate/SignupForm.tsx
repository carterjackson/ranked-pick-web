import { useCallback, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { useAuth } from "@/components/AuthContext";
import { Form } from "@/components/ui/Form";

interface Props {
	onComplete: () => void;
}

export function SignupForm({ onComplete }: Props) {
	const { signup } = useAuth();
	const [error, setError] = useState<string | null>(null);
	const [displayName, setDisplayName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [acceptedTos, setAcceptedTos] = useState(false);

	const handlePasswordConfirmationUpdate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setPasswordConfirmation(value);
		if (password && value && value != password) {
			setError("Password confirmation does not match");
		} else {
			setError(null);
		}
	}, [password]);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (password != passwordConfirmation) {
			setError("Password confirmation does not match");
			return;
		}

		await signup({
			username: username,
			password: password,
			display_name: displayName,
			password_confirmation: passwordConfirmation,
			accepted_tos: acceptedTos,
		});
		onComplete();
	};

	return (
		<Form onSubmit={onSubmit} error={error} submitLabel="Sign Up" className="[&>*]:mb-4">
			<Label htmlFor="username">Username</Label>
			<Input
				id="username"
				alt="username"
				value={username}
				onChange={e => setUsername(e.target.value)}
				required
			/>

			<Label htmlFor="displayname">Display Name (optional)</Label>
			<Input
				id="displayname"
				alt="display name"
				value={displayName}
				onChange={e => setDisplayName(e.target.value)}
			/>

			<Label htmlFor="password">Password</Label>
			<Input
				id="password"
				type="password"
				value={password}
				onChange={e => setPassword(e.target.value)}
				required
			/>

			<Label htmlFor="passwordconfirm">Confirm Password</Label>
			<Input
				id="passwordconfirm"
				type="password"
				value={passwordConfirmation}
				onChange={handlePasswordConfirmationUpdate}
				required
			/>

			<div className="flex mt-6">
				<Checkbox id="acceptedtos" checked={acceptedTos} onCheckedChange={checked => setAcceptedTos(checked as boolean)} required />
				<Label htmlFor="acceptedtos" className="ml-2">
					I accept the
					<a href="/terms" target="_blank" className="ml-1">Terms of Service</a> and
					<a href="/privacy" target="_blank" className="ml-1">Privacy Policy</a>
				</Label>
			</div>
		</Form>
	);
}
