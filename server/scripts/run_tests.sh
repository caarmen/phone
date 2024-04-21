rm -rf reports
python -m pytest --cov=phone --cov-report=xml --cov-report=html --junitxml="reports/junit.xml" tests
mkdir -p reports
mv coverage.xml htmlcov reports/.
