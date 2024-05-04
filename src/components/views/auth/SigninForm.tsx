import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Form } from "@/components/ui/Form";

interface Props {
	onClose: () => void;
}

export function SigninForm({ onClose }: Props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		console.log(e);
			e.preventDefault();
			setLoading(true);
			// try {
			//   await signin(email, password);
			// } catch (err) {
			//   setError(err.message);
			// } finally {
			//   setLoading(false);
			// }
	};

	return (
		<form onSubmit={onSubmit}>
			{/* {error && <p className="text-red-800 mb-4">{error}</p>} */}

			<Label htmlFor="email">Email</Label>
			<Input
				id="email"
				type="email"
				alt="email"
				value={email}
				onChange={e => setEmail(e.target.value)}
			/>

			<Label htmlFor="password">Password</Label>
			<Input
				id="password"
				type="password"
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>

			<div className="flex justify-end mt-4">
				<Button onClick={onClose} className="mr-2">Cancel</Button>
				<Button type="submit">
						{loading ? <Spinner /> : "Submit"}
				</Button>
			</div>
		</form>
	);
}