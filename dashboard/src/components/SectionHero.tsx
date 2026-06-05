import { getSectionVisual } from "@/lib/sectionVisuals";
import { useLocation } from "react-router-dom";

export default function SectionHero(): JSX.Element {
	const { pathname } = useLocation();
	const visual = getSectionVisual(pathname);

	return (
		<div className="relative mb-6 overflow-hidden rounded-xl border border-border/70 shadow-sm">
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: `url(${visual.image})` }}
				role="img"
				aria-label={visual.imageAlt}
			/>
			<div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/92 via-brand-green/75 to-brand-green/25" />
			<div className="relative flex min-h-[120px] flex-col justify-center gap-1 px-6 py-5 sm:min-h-[140px] sm:px-8">
				<p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
					SGI · O&apos;Marché Ivoire
				</p>
				<h1 className="text-xl font-bold text-white sm:text-2xl">
					{visual.title}
				</h1>
				<p className="max-w-xl text-sm text-white/85">{visual.subtitle}</p>
			</div>
		</div>
	);
}
