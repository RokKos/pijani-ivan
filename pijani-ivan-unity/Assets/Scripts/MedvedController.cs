using UnityEngine;
using UnityEngine.AI;

public class MedvedController : MonoBehaviour
{
    [Header("Bear settings")]
    [Range(1, 25)]
    [SerializeField] int bearLifes;

    [SerializeField] AudioSource bearRoar;

    [Header("NavMesh settings")]
    [SerializeField] NavMeshAgent navMeshAgent;

    [Range(0.1f,10)]
    [SerializeField] float kTimeToCalculate;

    [Range(1, 100)]
    [SerializeField] float kWakeUpRadius;

    private NavMeshPath path;
    private Transform player;
    private float timer = 0.0f;
    private const string kBulletTag = "Bullet";
    
    // Start is called before the first frame update
    void Start()
    {
        path = new NavMeshPath();
        timer = 0.0f;
        navMeshAgent.Warp(transform.position);
    }

    // Update is called once per frame
    void Update()
    {

        timer += Time.deltaTime;
        // First we calculate aproximation which is easier to compute
        if ((player.position - transform.position).sqrMagnitude < kWakeUpRadius * kWakeUpRadius) {
            Debug.Log("HERE");
            if (!bearRoar.isPlaying) {
                bearRoar.Play();
            }

            if (timer > kTimeToCalculate) {
                timer = 0;
                // If its smaller then we calculate more demanding path calculation
                NavMesh.CalculatePath(transform.position, player.position, NavMesh.AllAreas, path);

                // Calculate distance to player
                float distanceToPlayer = 0;
                for (int i = 0; i < path.corners.Length - 1; i++) {
                    distanceToPlayer += (path.corners[i] - path.corners[i + 1]).magnitude;
                }

                if (distanceToPlayer < kWakeUpRadius) {
                    navMeshAgent.SetDestination(player.position);
                    transform.LookAt(player);
                }
            }
        }

        // For debug porpuse only (we need to refresh every frame)
        for (int i = 0; i < path.corners.Length - 1; i++) {
            Debug.DrawLine(path.corners[i], path.corners[i + 1], Color.red);
        }
    }

    private void OnCollisionEnter(Collision collision) {
        if (collision.collider.gameObject.tag == kBulletTag) {
            bearLifes--;
            if (bearLifes <= 0) {
                Destroy(gameObject);
            }
        }
    }

    public void SetPlayerTransform(Transform _player) {
        player = _player;
    }
}
