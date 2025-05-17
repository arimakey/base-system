export default function LandingPage() {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
			}}
		>
			<a href="/api/auth/google">
				<button
					style={{
						padding: '12px 24px',
						fontSize: '16px',
						backgroundColor: '#4285F4',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
				>
					Login with Google
				</button>
			</a>
		</div>
	);
}
