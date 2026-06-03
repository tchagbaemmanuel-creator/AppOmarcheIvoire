# Copie le dernier APK EAS téléchargé vers le site vitrine (lien permanent).
param(
	[string]$BuildId,
	[string]$SiteDir = "$env:USERPROFILE\Desktop\PROJECT PERSO\omarche-site"
)

$ErrorActionPreference = "Stop"
$mobileDir = Split-Path $PSScriptRoot -Parent
Push-Location $mobileDir

try {
	if ($BuildId) {
		npx eas build:download --build-id $BuildId --non-interactive
	} else {
		$list = npx eas build:list --platform android --limit 1 --status finished --non-interactive 2>&1 | Out-String
		if ($list -notmatch "ID\s+([a-f0-9-]{36})") {
			throw "Aucun build Android terminé. Lancez: npm run build:android:preview"
		}
		$BuildId = $Matches[1]
		Write-Host "Build: $BuildId"
		npx eas build:download --build-id $BuildId --non-interactive
	}

	$apk = @(
		Get-ChildItem -Path (Join-Path $mobileDir "build-extract") -Filter "app-release.apk" -Recurse -File -ErrorAction SilentlyContinue
		Get-ChildItem -Path $mobileDir -Filter "*.apk" -Recurse -File -ErrorAction SilentlyContinue |
			Where-Object { $_.FullName -notmatch "node_modules" }
	) | Sort-Object LastWriteTime -Descending | Select-Object -First 1
	if (-not $apk) {
		$list = npx eas build:view $BuildId 2>&1 | Out-String
		if ($list -match "Application Archive URL\s+(\S+)") {
			$archiveUrl = $Matches[1].Trim()
			if ($archiveUrl -match "\.tar\.gz") {
				$tg = Join-Path $mobileDir "build-artifact.tar.gz"
				$extract = Join-Path $mobileDir "build-extract"
				Invoke-WebRequest -Uri $archiveUrl -OutFile $tg -UseBasicParsing
				New-Item -ItemType Directory -Force -Path $extract | Out-Null
				tar -xzf $tg -C $extract release/app-release.apk 2>$null
				$apk = Get-Item (Join-Path $extract "release\app-release.apk") -ErrorAction SilentlyContinue
			}
		}
	}
	if (-not $apk) { throw "APK introuvable après téléchargement EAS." }

	$destDir = Join-Path $SiteDir "downloads"
	New-Item -ItemType Directory -Force -Path $destDir | Out-Null
	$dest = Join-Path $destDir "omarche-ivoire.apk"
	Copy-Item -Path $apk.FullName -Destination $dest -Force
	$mb = [math]::Round($apk.Length / 1MB, 1)
	Write-Host "OK: $dest ($mb Mo)"
	Write-Host "Puis dans omarche-site: git add downloads/omarche-ivoire.apk site-config.js && git commit && git push"
}
finally {
	Pop-Location
}
