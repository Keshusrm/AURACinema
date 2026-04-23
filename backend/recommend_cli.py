#!/usr/bin/env python3
"""
Aura Cinema — CLI Recommender
Usage: python recommend_cli.py --query "your text" --top_n 5
"""

import argparse
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text
from rich import box

from ml_engine import engine


def main():
    parser = argparse.ArgumentParser(description="Aura Cinema CLI Recommender")
    parser.add_argument("--query", "-q", type=str, required=True, help="Describe what you want to watch")
    parser.add_argument("--top_n", "-n", type=int, default=5, help="Number of recommendations")
    args = parser.parse_args()

    console = Console()

    # Header
    console.print()
    console.print(Panel(
        Text("🎬 AURA CINEMA", style="bold magenta", justify="center"),
        subtitle="AI-Powered Recommender",
        border_style="bright_magenta",
        padding=(1, 4),
    ))

    # Train models
    with console.status("[bold magenta]Training ML models...", spinner="dots"):
        result = engine.recommend(query=args.query, top_n=args.top_n)

    # Model stats
    console.print()
    console.print(f"[bold green]✅ Best Model:[/] [bold yellow]{result['best_model']}[/]")
    console.print()

    stats_table = Table(title="📊 Model Performance", box=box.ROUNDED, border_style="magenta")
    stats_table.add_column("Model", style="cyan", no_wrap=True)
    stats_table.add_column("Accuracy", justify="center")
    stats_table.add_column("Precision", justify="center")
    stats_table.add_column("Recall", justify="center")
    stats_table.add_column("F1 Score", justify="center", style="bold")

    for model_name, metrics in result["model_scores"].items():
        is_best = "🏆 " if model_name == result["best_model"] else "   "
        stats_table.add_row(
            f"{is_best}{model_name}",
            f"{metrics['accuracy']:.4f}",
            f"{metrics['precision']:.4f}",
            f"{metrics['recall']:.4f}",
            f"[bold yellow]{metrics['f1']:.4f}[/]" if model_name == result["best_model"] else f"{metrics['f1']:.4f}",
        )

    console.print(stats_table)
    console.print()

    # Results
    results_table = Table(
        title=f"🎯 Top {len(result['results'])} Recommendations for: \"{args.query}\"",
        box=box.ROUNDED,
        border_style="bright_magenta",
        show_lines=True,
    )
    results_table.add_column("#", style="dim", width=3, justify="center")
    results_table.add_column("Title", style="bold white", min_width=20)
    results_table.add_column("Type", justify="center", width=10)
    results_table.add_column("Genre", style="dim cyan", min_width=15)
    results_table.add_column("Year", justify="center", width=6)
    results_table.add_column("Rating", justify="center", width=8)
    results_table.add_column("Score", justify="center", width=8, style="bold green")
    results_table.add_column("Description", max_width=40)

    for i, item in enumerate(result["results"], 1):
        type_color = "magenta" if item["type"] == "Movie" else "cyan"
        desc = item["description"][:80] + "..." if len(item["description"]) > 80 else item["description"]
        results_table.add_row(
            str(i),
            item["title"],
            f"[{type_color}]{item['type']}[/{type_color}]",
            item["listed_in"][:30],
            str(item["release_year"]),
            item["rating"],
            f"{item['relevance_score']:.2%}",
            desc,
        )

    console.print(results_table)
    console.print()


if __name__ == "__main__":
    main()
