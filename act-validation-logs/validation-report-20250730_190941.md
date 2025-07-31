# Workflow Validation Report

**Generated:** Wed Jul 30 19:09:43 EDT 2025  
**Workflows Validated:** 1  
**Issues Found:** 64  
**Issues Fixed:** 0  

## Validation Configuration

- **Strict Mode:** false
- **Security Mode:** false  
- **Performance Mode:** false
- **Fix Mode:** false

## Validation Results

- **ci.yml** (structure): Unknown trigger event: contents [error]
- **ci.yml** (structure): Unknown trigger event: pull-requests [error]
- **ci.yml** (structure): Unknown trigger event: checks [error]
- **ci.yml** (job): Job 'push' missing runs-on specification [error]
- **ci.yml** (job): Job 'pull_request' missing runs-on specification [error]
- **ci.yml** (job): Job 'contents' missing runs-on specification [error]
- **ci.yml** (job): Job 'read' missing runs-on specification [error]
- **ci.yml** (job): Job 'read' has no steps defined [error]
- **ci.yml** (job): Job 'issues' missing runs-on specification [error]
- **ci.yml** (job): Job 'write' missing runs-on specification [error]
- **ci.yml** (job): Job 'write' has no steps defined [error]
- **ci.yml** (job): Job 'pull-requests' missing runs-on specification [error]
- **ci.yml** (job): Job 'write' missing runs-on specification [error]
- **ci.yml** (job): Job 'write' has no steps defined [error]
- **ci.yml** (job): Job 'read' missing runs-on specification [error]
- **ci.yml** (job): Job 'read' has no steps defined [error]
- **ci.yml** (job): Job '${{' missing runs-on specification [error]
- **ci.yml** (job): Job '${{' has no steps defined [error]
- **ci.yml** (job): Job 'github.workflow' missing runs-on specification [error]
- **ci.yml** (job): Job 'github.workflow' has no steps defined [error]
- **ci.yml** (job): Job '}}-${{' missing runs-on specification [error]
- **ci.yml** (job): Job '}}-${{' has no steps defined [error]
- **ci.yml** (job): Job 'github.ref' missing runs-on specification [error]
- **ci.yml** (job): Job 'github.ref' has no steps defined [error]
- **ci.yml** (job): Job '}}' missing runs-on specification [error]
- **ci.yml** (job): Job '}}' has no steps defined [error]
- **ci.yml** (job): Job 'true' missing runs-on specification [error]
- **ci.yml** (job): Job 'true' has no steps defined [error]
- **ci.yml** (job): Job ''18'' missing runs-on specification [error]
- **ci.yml** (job): Job ''18'' has no steps defined [error]
- **ci.yml** (job): Job 'postgresql//postgrespostgres@localhost5432/test_db' missing runs-on specification [error]
- **ci.yml** (job): Job 'postgresql//postgrespostgres@localhost5432/test_db' has no steps defined [error]
- **ci.yml** (job): Job '${{' missing runs-on specification [error]
- **ci.yml** (job): Job '${{' has no steps defined [error]
- **ci.yml** (job): Job 'secrets.AUTH_SECRET' missing runs-on specification [error]
- **ci.yml** (job): Job 'secrets.AUTH_SECRET' has no steps defined [error]
- **ci.yml** (job): Job '||' missing runs-on specification [error]
- **ci.yml** (job): Job '||' has no steps defined [error]
- **ci.yml** (job): Job ''test-secret-for-ci'' missing runs-on specification [error]
- **ci.yml** (job): Job ''test-secret-for-ci'' has no steps defined [error]
- **ci.yml** (job): Job '}}' missing runs-on specification [error]
- **ci.yml** (job): Job '}}' has no steps defined [error]
- **ci.yml** (job): Job 'http//localhost3000' missing runs-on specification [error]
- **ci.yml** (job): Job 'http//localhost3000' has no steps defined [error]
- **ci.yml** (job): Job '${{' missing runs-on specification [error]
- **ci.yml** (job): Job '${{' has no steps defined [error]
- **ci.yml** (job): Job 'secrets.AUTH_DISCORD_ID' missing runs-on specification [error]
- **ci.yml** (job): Job 'secrets.AUTH_DISCORD_ID' has no steps defined [error]
- **ci.yml** (job): Job '||' missing runs-on specification [error]
- **ci.yml** (job): Job '||' has no steps defined [error]
- **ci.yml** (job): Job ''test-client-id'' missing runs-on specification [error]
- **ci.yml** (job): Job ''test-client-id'' has no steps defined [error]
- **ci.yml** (job): Job '}}' missing runs-on specification [error]
- **ci.yml** (job): Job '}}' has no steps defined [error]
- **ci.yml** (job): Job '${{' missing runs-on specification [error]
- **ci.yml** (job): Job '${{' has no steps defined [error]
- **ci.yml** (job): Job 'secrets.AUTH_DISCORD_SECRET' missing runs-on specification [error]
- **ci.yml** (job): Job 'secrets.AUTH_DISCORD_SECRET' has no steps defined [error]
- **ci.yml** (job): Job '||' missing runs-on specification [error]
- **ci.yml** (job): Job '||' has no steps defined [error]
- **ci.yml** (job): Job ''test-client-secret'' missing runs-on specification [error]
- **ci.yml** (job): Job ''test-client-secret'' has no steps defined [error]
- **ci.yml** (job): Job '}}' missing runs-on specification [error]
- **ci.yml** (job): Job '}}' has no steps defined [error]

## Recommendations

- Review and address the validation issues above
- Consider running with --fix flag to auto-resolve common issues
- Run with --security flag for comprehensive security validation
- Run with --performance flag for performance optimization suggestions

---
*Generated by act-validate.sh*
