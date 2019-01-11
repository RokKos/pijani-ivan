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

    [SerializeField] Animator bearAnimator;

    private NavMeshPath path;
    private Transform player;
    private float timer = 0.0f;
    private const string kBulletTag = "Bullet";
    private const string kPlayerTag = "Player";

    private bool wokenUp = false;

    // Start is called before the first frame update
    void Start()
    {
        path = new NavMeshPath();
        timer = 0.0f;
        navMeshAgent.Warp(transform.position);

        player = GameController.Instance.player.transform;
    }

    // Update is called once per frame
    void Update()
    {

        timer += Time.deltaTime;
        // First we calculate aproximation which is easier to compute

        if (! wokenUp && (player.position - transform.position).sqrMagnitude < kWakeUpRadius * kWakeUpRadius)
        {
            bearRoar.Play();
            wokenUp = true;
        }

        if (wokenUp) {
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

            if (navMeshAgent.velocity.sqrMagnitude > 0.1f)
            {
                bearAnimator.SetBool("Walking", true);
                bearAnimator.SetFloat("Speed", navMeshAgent.velocity.magnitude);
            }
            else
            {
                bearAnimator.SetBool("Walking", false);
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

    public void PlayRoarSound()
    {
        if (!bearRoar.isPlaying)
        {
            bearRoar.Play();
        }
    }

    private void OnTriggerEnter(Collider other)
    {
        Debug.Log(other);
        if (other.gameObject.tag == kPlayerTag)
        {
            bearAnimator.SetBool("Attack", true);
            PlayRoarSound();
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (other.gameObject.tag == kPlayerTag)
        {
            bearAnimator.SetBool("Attack", false);
        }
    }

    public void SetPlayerTransform(Transform _player) {
        player = _player;
    }
}
