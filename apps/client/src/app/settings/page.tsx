import { useUserStore } from '../../stores/user.store';

export default function UserConfigPage() {
	const user = useUserStore((state) => state.user);

	if (!user) {
		return <div className="p-4 text-gray-500">Cargando usuario...</div>;
	}

	return (
		<div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg space-y-4">
			<h1 className="text-2xl font-bold text-gray-800">
				Configuración del Usuario
			</h1>

			<div className="space-y-2">
				<div>
					<span className="font-semibold text-gray-700">Nombre:</span>{' '}
					{user.name}
				</div>
				<div>
					<span className="font-semibold text-gray-700">Email:</span>{' '}
					{user.email}
				</div>
				<div>
					<span className="font-semibold text-gray-700">ID:</span>{' '}
					{user.id}
				</div>
				<div>
					<span className="font-semibold text-gray-700">Roles:</span>
					<ul className="list-disc list-inside ml-4 text-sm text-gray-700">
						{user.roles.map((role) => (
							<li key={role}>{role}</li>
						))}
					</ul>
				</div>
				<div>
					<span className="font-semibold text-gray-700">
						Permisos:
					</span>
					<ul className="grid grid-cols-2 gap-1 list-disc list-inside ml-4 text-sm text-gray-700">
						{user.permissions.map((perm) => (
							<li key={perm}>{perm}</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
