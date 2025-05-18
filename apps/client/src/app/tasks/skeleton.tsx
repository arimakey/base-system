export default function SkeletonRow() {
	return (
		<tr>
			<td className="px-4 py-2">
				<div className="h-4 w-24 skeleton"></div>
			</td>
			<td className="px-4 py-2">
				<div className="h-4 w-48 skeleton"></div>
			</td>
			<td className="px-4 py-2">
				<div className="h-6 w-20 skeleton inline-block"></div>
				<div className="h-6 w-20 skeleton inline-block ml-2"></div>
			</td>
		</tr>
	);
}
