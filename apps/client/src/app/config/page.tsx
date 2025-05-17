import { useUserStore } from '../../stores/user.store';

export default function UserConfigPage() {
	const user = useUserStore((state) => state.user);

	return (
		<div>
			<div>{JSON.stringify(user)}</div>
		</div>
	);
}
