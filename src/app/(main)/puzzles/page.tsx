import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export default function PuzzlesPage() {
    const puzzleTypes = [
        {
            id: 'sudoku',
            title: 'Sudoku',
            description: 'Classic logic-based number placement puzzle. 4x4 and 6x6 grids available.',
            icon: 'ui/sudoku_icon',
            href: '/puzzles/sudoku',
            color: 'bg-primary/20 border-primary/30',
        },
        {
            id: 'memory',
            title: 'Memory Match',
            description: 'Test your memory and match pairs of colorful gems.',
            icon: 'gems/gem_1',
            href: '/puzzles/memory',
            color: 'bg-accent/20 border-accent/30',
        },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-8 text-center sm:text-left">Select a Puzzle</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {puzzleTypes.map((puzzle) => (
                    <Link href={puzzle.href} key={puzzle.id} className="block group">
                        <Card variant="elevated" className={`p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full border-2 border-transparent group-hover:${puzzle.color.split(' ')[1]}`}>
                            <div className="flex items-start gap-4 h-full">
                                <div className={`p-4 rounded-xl ${puzzle.color}`}>
                                    <Icon assetKey={puzzle.icon} size="xl" className="group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{puzzle.title}</h2>
                                    <p className="text-foreground/70">{puzzle.description}</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
