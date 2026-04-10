
# Script to upload Sayarati to GitHub
Write-Host "🚀 بدء عملية الرفع على GitHub..." -ForegroundColor Cyan

# Check if git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git غير مثبت على جهازك. يرجى تثبيته أولاً." -ForegroundColor Red
    exit
}

# Initialize Git if not already initialized
if (!(Test-Path .git)) {
    git init
    Write-Host "✅ تم تهيئة Git بنجاح." -ForegroundColor Green
}

# Create .gitignore if it doesn't exist (should exist)
if (!(Test-Path .gitignore)) {
    @'
node_modules/
.next/
.env*
!.env.example
.DS_Store
'@ | Out-File -FilePath .gitignore -Encoding utf8
}

# Add all files
git add .
git commit -m "إعداد المشروع الأولي مع ربط قاعدة البيانات"

# Try to create repo using GH CLI if available
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "📦 محاولة إنشاء المستودع 'syar'..." -ForegroundColor Yellow
    gh repo create syar --public --source=. --remote=origin --push
} else {
    Write-Host "⚠️ لم يتم العثور على GitHub CLI (gh). يرجى:" -ForegroundColor Yellow
    Write-Host "1. إنشاء مستودع جديد يدوياً في GitHub باسم 'syar'"
    Write-Host "2. ثم تشغيل الأوامر التالية:"
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/syar.git"
    Write-Host "   git branch -M main"
    Write-Host "   git push -u origin main"
}

Write-Host "✨ انتهت العملية!" -ForegroundColor Cyan
