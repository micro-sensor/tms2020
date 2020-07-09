## Deleting existing database

- delete a database

```DROP DATABASE [IF EXISTS] database_name;```

- delete a database that has active connections 
    - find the activities that are taken place against the target database:
    ```
    SELECT
        *
    FROM
        pg_stat_activity
    WHERE
        datname = 'database_name';
    ```
    - terminate the active connections:
    ```
    SELECT
    	pg_terminate_backend (pg_stat_activity.pid)
    FROM
    	pg_stat_activity
    WHERE
    	pg_stat_activity.datname = 'database_name';
    ```
    - delete:
    ```
    DROP DATABASE database_name;
    ```  

